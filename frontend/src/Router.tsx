import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import NotFound from "./pages/404";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
            // {
            //     path:"",
            //     element:<Login />,
            // },
			{
				path: "*",
				element: <NotFound />,
			},
		],
	},
]);

export const Router = () => <RouterProvider router={router} />;
