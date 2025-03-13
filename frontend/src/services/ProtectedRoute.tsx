// src/components/ProtectedRoute.tsx
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/Auth-Store";

interface ProtectedRouteProps {
	children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated, isInitialized } = useAuthStore();
	const location = useLocation();

	// Don't render anything until auth check completes
	if (!isInitialized) return null;

	return isAuthenticated ? (
		children
	) : (
		<Navigate to="/login" state={{ from: location }} replace />
	);
}
