import { useEffect } from "react";
import useAuthStore from "../store/Auth-Store";

export const useAuth = () => {
	const {
		user,
		accessToken,
		isLoading,
		isAuthenticated,
		login,
		register,
		logout,
		checkAuth,
	} = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, []);

	return {
		user,
		accessToken,
		isLoading,
		isAuthenticated,
		login,
		logout,
		register,
	};
};
