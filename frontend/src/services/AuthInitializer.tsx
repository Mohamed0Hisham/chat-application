import { useEffect } from "react";
import useAuthStore from "../store/Auth-Store";

const AuthInitializer = () => {
	const checkAuth = useAuthStore((state) => state.checkAuth);

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	return null;
};

export default AuthInitializer;
