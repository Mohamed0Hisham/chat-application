import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "../pages/Auth/Register";
import App from "../App";
import NotFound from "../pages/error/404";
import Login from "../pages/Auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Chat/Dashboard";
import Find from "../pages/Friends/Find";
import Requests from "../pages/Friends/Requests";
import Me from "../pages/Profile/Me";
import Chat from "../pages/Chat/chat";

const routes = createBrowserRouter([
	{
		path: "/",
		element: <App />,
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
