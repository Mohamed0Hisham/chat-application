import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Auth/Register";
import App from "./App";
import NotFound from "./pages/error/404";

const routes = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
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

export const Router = () => <RouterProvider router={routes} />;
