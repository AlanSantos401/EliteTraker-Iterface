import { RouterProvider } from "react-router-dom";

import { UserProvider } from "./hooks/use-user";
import { Router } from "./routes";

export function App() {
    return (
        <UserProvider>
			<RouterProvider router={Router} />
		</UserProvider>
    )
}