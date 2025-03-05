import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "../pages/Auth/Register";
import App from "../App";
import NotFound from "../pages/error/404";
import Login from "../pages/Auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Chat/Dashboard";

const routes = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <NotFound />,
		children: [
			{
				index: true, // Default route
				element: (
					// <ProtectedRoute>
					// 	<Dashboard />
					// </ProtectedRoute>
					<Dashboard />
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
