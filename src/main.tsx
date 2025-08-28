import "./styles/global.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "./routes";
import { RouterProvider } from "react-router-dom";
import { UserProvider } from "./hooks/use-use";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<UserProvider>
          <RouterProvider router={Router} />
		</UserProvider>
		
	</StrictMode>,
);
