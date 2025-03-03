// src/hooks/useAuth.ts
import { useEffect } from "react";
import axios from "axios";
import { create } from "zustand";

// Define the shape of the authentication state
interface AuthState {
	user: { userID: string; fullName: string; email: string } | null;
	token: string | null;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	checkAuth: () => void;
}

// Create a Zustand store for authentication state
const useAuthStore = create<AuthState>((set) => ({
	user: null,
	token: null,
	isAuthenticated: false,

	// Login function
	login: async (email, password) => {
		try {
			const response = await axios.post("/api/users/login", {
				email,
				password,
			});
			const { token, userID, fullName, email: userEmail } = response.data;

			// Update state
			set({
				user: { userID, fullName, email: userEmail },
				token,
				isAuthenticated: true,
			});

			// Save token and user data to localStorage
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

	// Logout function
	logout: () => {
		// Clear state
		set({ user: null, token: null, isAuthenticated: false });

		// Remove token and user data from localStorage
		localStorage.removeItem("token");
		localStorage.removeItem("user");
	},

	// Check authentication status
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

// Custom hook to use the auth store
export const useAuth = () => {
	const { user, token, isAuthenticated, login, logout, checkAuth } =
		useAuthStore();

	// Check authentication status on mount
	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	return { user, token, isAuthenticated, login, logout };
};
