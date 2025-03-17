import { useEffect } from "react";
import useAuthStore from "../store/Auth-Store";
import Loader from "../components/shared/Loader";

const AppLoader = ({ children }: { children: React.ReactNode }) => {
	const { checkAuth, isAuthenticated } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	// if (!isAuthenticated) {
	// 	return <Loader />;
	// }

	return <>{children}</>;
};

export default AppLoader;
