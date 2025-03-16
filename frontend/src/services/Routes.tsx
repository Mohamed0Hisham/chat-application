import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";

import App from "../App";
import Loader from "../components/shared/Loader";
const Register = lazy(() => import("../pages/Auth/Register"));
const NotFound = lazy(() => import("../pages/error/404"));
const Login = lazy(() => import("../pages/Auth/Login"));
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));
const Dashboard = lazy(() => import("../pages/Chat/Dashboard"));
const Find = lazy(() => import("../pages/Friends/Find"));
const Requests = lazy(() => import("../pages/Friends/Requests"));
const Chat = lazy(() => import("../pages/Chat/chat"));
const Me = lazy(() => import("../pages/Profile/Me"));

const routes = createBrowserRouter([
	{
		path: "/",
		element: (
			<Suspense fallback={<Loader />}>
				<App />
			</Suspense>
		),
		errorElement: <NotFound />,
		children: [
			{
				path: "/chat",
				element: (
					<ProtectedRoute>
						<Chat />
					</ProtectedRoute>
				),
			},
			{
				path: "/profile",
				element: (
					<ProtectedRoute>
						<Me />
					</ProtectedRoute>
				),
			},
			{
				path: "/add",
				element: (
					<ProtectedRoute>
						<Find />
					</ProtectedRoute>
				),
			},
			{
				path: "/requests",
				element: (
					<ProtectedRoute>
						<Requests />
					</ProtectedRoute>
				),
			},
			{
				path: "/register",
				element: <Register />,
			},
			{
				path: "/login",
				element: <Login />,
			},
			{
				path: "/dashboard",
				element: (
					<ProtectedRoute>
						<Dashboard />
					</ProtectedRoute>
				),
			},
			{
				path: "*",
				element: <NotFound />,
			},
		],
	},
]);

export const Router = () => <RouterProvider router={routes} />;
