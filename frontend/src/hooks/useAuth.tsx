import { useEffect } from "react";
import useAuthStore from "../store/Auth-Store";

export const useAuth = () => {
	const {
		user,
		token,
		isAuthenticated,
		isLoading,
		login,
		logout,
		checkAuth,
	} = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	return { user, token, isAuthenticated, isLoading, login, logout };
};
