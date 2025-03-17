import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense, FC } from "react";

import App from "../App";
import Loader from "../components/shared/Loader";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "../pages/error/404";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

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
		element: <App />,
		errorElement: <NotFound />,
		children: [
			{
				index: true,
				element: <Login />,
			},
			{
				path: "register",
				element: <Register />,
			},
			{
				path: "chat",
				element: (
					<ProtectedRoute>
						<Suspense fallback={<Loader />}>
							<Chat />
						</Suspense>
					</ProtectedRoute>
				),
			},
			{
				path: "profile",
				element: (
					<ProtectedRoute>
						<Suspense fallback={<Loader />}>
							<Me />
						</Suspense>
					</ProtectedRoute>
				),
			},
			{
				path: "add",
				element: (
					<ProtectedRoute>
						<Suspense fallback={<Loader />}>
							<Find />
						</Suspense>
					</ProtectedRoute>
				),
			},
			{
				path: "requests",
				element: (
					<ProtectedRoute>
						<Suspense fallback={<Loader />}>
							<Requests />
						</Suspense>
					</ProtectedRoute>
				),
			},
			{
				path: "dashboard",
				element: (
					<ProtectedRoute>
						<Suspense fallback={<Loader />}>
							<Dashboard />
						</Suspense>
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
