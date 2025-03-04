import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
	const { user, token, isAuthenticated, login, logout, checkAuth } =
		useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	return { user, token, isAuthenticated, login, logout };
};
