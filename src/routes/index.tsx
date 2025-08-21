import { createBrowserRouter } from "react-router-dom";
import { Login } from "../pages/login";
import { Habits } from "../pages/habits";

export const Router = createBrowserRouter([
	{
		path: "/",
		element: <Habits />,
	},
	{
		path: "/entrar",
		element: <Login />,
	},
]);
