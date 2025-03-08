import { create } from "zustand";
import api from "../services/api";

type User = { userID: string; fullname: string; email: string };

interface AuthState {
	user?: User;
	token?: string;
	isAuthenticated: boolean;
	isLoading: boolean;
	checkAuth: () => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
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
				const response = await api.get(
					`/api/users/:${JSON.parse(user).userID}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				set({
					user: response.data, // Update with fresh user data
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
	login: async (email, password) => {
		try {
			set({ isLoading: true });
			const response = await api.post("/api/users/login", {
				email,
				password,
			});
			const { token, userID, fullname, email: userEmail } = response.data;

			localStorage.setItem("token", token);
			localStorage.setItem(
				"user",
				JSON.stringify({ userID, fullname, email: userEmail })
			);
			set({
				user: { userID, fullname, email: userEmail },
				token,
				isAuthenticated: true,
				isLoading: false,
			});
		} catch (error:unknown) {
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
