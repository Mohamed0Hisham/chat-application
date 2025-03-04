import { create } from "zustand";
import api from "../utils/api";

interface AuthState {
	user: { userID: string; fullName: string; email: string } | null;
	token: string | null;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	token: null,
	isAuthenticated: false,

	login: async (email, password) => {
		try {
			const response = await api.post("/api/users/login", {
				email,
				password,
			});
			const { token, userID, fullName, email: userEmail } = response.data;

			set({
				user: { userID, fullName, email: userEmail },
				token,
				isAuthenticated: true,
			});
			localStorage.setItem("token", token);
			localStorage.setItem(
				"user",
				JSON.stringify({ userID, fullName, email: userEmail })
			);
		} catch (error) {
			console.error("Login failed:", error);
			throw error;
		}
	},

	logout: () => {
		set({ user: null, token: null, isAuthenticated: false });
		localStorage.removeItem("token");
		localStorage.removeItem("user");
	},

	checkAuth: () => {
		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user");

		if (token && user) {
			set({ user: JSON.parse(user), token, isAuthenticated: true });
		} else {
			set({ user: null, token: null, isAuthenticated: false });
		}
	},
}));
