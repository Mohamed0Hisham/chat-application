// src/components/ProtectedRoute.tsx
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/auth";

interface ProtectedRouteProps {
	children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated } = useAuthStore();
	const location = useLocation();

	return isAuthenticated ? (
		children
	) : (
		<Navigate to="/" state={{ from: location }} replace />
	);
}
