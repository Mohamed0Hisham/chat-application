// AppLoader.tsx
import { useEffect } from "react";
import useAuthStore from "../store/Auth-Store";

const AppLoader = ({ children }: { children: React.ReactNode }) => {
	const { checkAuth, isInitialized } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	// Show loading screen until auth state is determined
	if (!isInitialized) {
		return <div className="fullscreen-loading">Loading...</div>;
	}

	return <>{children}</>;
};

export default AppLoader;
