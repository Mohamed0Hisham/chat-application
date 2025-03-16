import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense, FC } from "react";

import App from "../App";
import Loader from "../components/shared/Loader";
const ProtectedRoute = lazy(() => import("./ProtectedRoute"));

const Register = lazy(
	(): Promise<{ default: FC }> => import("../pages/Auth/Register")
);
const NotFound = lazy(
	(): Promise<{ default: FC }> => import("../pages/error/404")
);
const Login = lazy(
	(): Promise<{ default: FC }> => import("../pages/Auth/Login")
);
const Dashboard = lazy(
	(): Promise<{ default: FC }> => import("../pages/Chat/Dashboard")
);
const Find = lazy(
	(): Promise<{ default: FC }> => import("../pages/Friends/Find")
);
const Requests = lazy(
	(): Promise<{ default: FC }> => import("../pages/Friends/Requests")
);
const Chat = lazy((): Promise<{ default: FC }> => import("../pages/Chat/chat"));
const Me = lazy((): Promise<{ default: FC }> => import("../pages/Profile/Me"));

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
				path: "/register",
				element: (
					<Suspense fallback={<Loader />}>
						<Register />
					</Suspense>
				),
			},
			{
				path: "/login",
				element: (
					<Suspense fallback={<Loader />}>
						<Login />
					</Suspense>
				),
			},
			{
				path: "/chat",
				element: (
					<Suspense fallback={<Loader />}>
						<ProtectedRoute>
							<Chat />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: "/profile",
				element: (
					<Suspense fallback={<Loader />}>
						<ProtectedRoute>
							<Me />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: "/add",
				element: (
					<Suspense fallback={<Loader />}>
						<ProtectedRoute>
							<Find />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: "/requests",
				element: (
					<Suspense fallback={<Loader />}>
						<ProtectedRoute>
							<Requests />
						</ProtectedRoute>
					</Suspense>
				),
			},
			{
				path: "/dashboard",
				element: (
					<Suspense fallback={<Loader />}>
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					</Suspense>
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
