import { useEffect } from "react";
import useAuthStore from "../store/Auth-Store";

export const useAuth = () => {
	const { user, accessToken, isLoading, login, register, logout, checkAuth } =
		useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	return { user, accessToken, isLoading, login, logout, register };
};
