// src/components/ProtectedRoute.tsx
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
	children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		// Show a loading indicator while auth status is being determined
		return <div>Loading...</div>;
	}
	if (!isAuthenticated) {
		return <Navigate to="/login" state={{ from: location }} replace/>;
	}

	return <>{children}</>;
}
