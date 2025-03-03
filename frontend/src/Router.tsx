import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import NotFound from "./pages/404";
import Login from "./pages/Auth/Login.tsx";
import Register from "./pages/Auth/Register.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "login",
				element: <Login />,
			},
			{
				path: "register",
				element: <Register />,
			},
			{
				path: "*",
				element: <NotFound />,
			},
		],
	},
]);

export const Router = () => <RouterProvider router={router} />;
