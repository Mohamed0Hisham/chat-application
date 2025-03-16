import { useEffect } from "react";
import useAuthStore from "../store/Auth-Store";
import Loader from "../components/shared/Loader";

const AppLoader = ({ children }: { children: React.ReactNode }) => {
	const { checkAuth, isInitialized } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (!isInitialized) {
		return <Loader />;
	}

	return <>{children}</>;
};

export default AppLoader;
