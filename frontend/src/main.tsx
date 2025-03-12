import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "./services/Routes.tsx";
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Router />
	</StrictMode>
);
