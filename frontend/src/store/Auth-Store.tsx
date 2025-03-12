import { create } from "zustand";
import api from "../services/api";

type User = { _id: string; fullname: string; email: string };

interface AuthState {
	user?: User;
	accessToken?: string;
	isLoading: boolean;
	isAuthenticated: boolean;
	checkAuth: () => Promise<void>;
	register: (a: string, b: string, c: string) => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	refreshAccessToken: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
	user: undefined,
	accessToken: undefined,
	isLoading: false,
	isAuthenticated: false,

	checkAuth: async () => {
		set({
			isLoading: true,
		});

		const token = localStorage.getItem("accessToken");
		const userString = localStorage.getItem("user");

		if (token && userString) {
			try {
				const storedUser = JSON.parse(userString);
				const response = await api.get(`/users/${storedUser._id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				set({
					user: response.data.data,
					accessToken: token,
					isAuthenticated: true,
				});
			} catch (error) {
				console.error("check auth method failed", error);
				set({
					user: undefined,
					accessToken: undefined,
					isAuthenticated: false,
				});
				localStorage.removeItem("accessToken");
				localStorage.removeItem("user");
			}
		}
		set({
			isLoading: false,
		});
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
			console.error("failed to register the user:", error);
			set({
				isLoading: false,
			});
		}
	},
	login: async (email, password) => {
		try {
			set({ isLoading: true, isAuthenticated: false });
			const response = await api.post("/users/login", {
				email,
				password,
			});
			const { accessToken, user } = response.data;

			localStorage.setItem("accessToken", accessToken);
			localStorage.setItem("user", JSON.stringify(user));
			set({
				user: user,
				accessToken,
				isAuthenticated: true,
			});
			console.log(user)
		} catch (error: unknown) {
			console.error("login failed", error);
			set({
				user: undefined,
				accessToken: undefined,
				isAuthenticated: false,
			});
		} finally {
			set({ isLoading: false });
		}
	},
	logout: async () => {
		try {
			await api.post("/api/users/logout");
		} catch (error) {
			console.error("Logout failed:", error);
		}
		localStorage.removeItem("accessToken");
		localStorage.removeItem("user");
		set({
			user: undefined,
			accessToken: undefined,
			isLoading: false,
			isAuthenticated: false,
		});
	},
	refreshAccessToken: async () => {
		try {
			set({ isLoading: true });
			const response = await api.post("/api/auth/refresh");
			const { accessToken } = response.data;

			localStorage.setItem("accessToken", accessToken);
			set({ accessToken, isLoading: false });
			return accessToken;
		} catch (error) {
			console.error("Token refresh failed:", error);
			get().logout();
			throw error;
		}
	},
}));

export default useAuthStore;
