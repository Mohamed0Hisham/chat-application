import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "./pages/Auth/Register";
import App from "./App";

const routes = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children:[
			{
				path:"register",
				element:<Register />
			}
		]
	},
]);

export const Router = () => <RouterProvider router={routes} />;
