import { create } from "zustand";
import api from "../services/api";

type User = { _id: string; fullname: string; email: string };

interface AuthState {
	user?: User;
	token?: string;
	isAuthenticated: boolean;
	isLoading: boolean;
	checkAuth: () => Promise<void>;
	register: (a: string, b: string, c: string) => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
	user: undefined,
	token: undefined,
	isAuthenticated: false,
	isLoading: false,

	checkAuth: async () => {
		set({ isLoading: true });
		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user");

		if (token && user) {
			try {
				const response = await api.get(`/users/${get().user?._id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				set({
					user: response.data.data,
					token,
					isAuthenticated: true,
					isLoading: false,
				});
			} catch (error) {
				console.error(error);
				set({
					user: undefined,
					token: undefined,
					isAuthenticated: false,
					isLoading: false,
				});
				localStorage.removeItem("token");
				localStorage.removeItem("user");
			}
		} else {
			set({
				user: undefined,
				token: undefined,
				isAuthenticated: false,
				isLoading: false,
			});
		}
	},
	register: async (fullname, email, password) => {
		set({ isLoading: true });
		try {
			await api.post(`/users/register`, {
				email,
				password,
				fullname,
			});
			set({ isLoading: false });
		} catch (error) {
			console.error(error);
			set({
				user: undefined,
				token: undefined,
				isAuthenticated: false,
				isLoading: false,
			});
		}
	},
	login: async (email, password) => {
		try {
			set({ isLoading: true });
			const response = await api.post("/users/login", {
				email,
				password,
			});
			const { accessToken: token, user } = response.data;

			localStorage.setItem("token", token);
			localStorage.setItem("user", JSON.stringify(user));
			set({
				user: user,
				token,
				isAuthenticated: true,
				isLoading: false,
			});
		} catch (error: unknown) {
			set({ isLoading: false });
			console.error("Login failed:", error);
			throw error instanceof Error ? error : new Error("Login failed");
		}
	},
	logout: () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		set({
			user: undefined,
			token: undefined,
			isAuthenticated: false,
			isLoading: false,
		});
	},
}));

export default useAuthStore;
