import { Outlet } from "react-router-dom";
import useAuthStore from "./store/Auth-Store";
import AuthInitializer from "./services/AuthInitializer";
const App = () => {
	const { isLoggingOut } = useAuthStore();

	return (
		<>
			<AuthInitializer />
			<Outlet />
			{isLoggingOut && (
				<div className="logout-overlay">
					<p>Logging out...</p>
				</div>
			)}
		</>
	);
};

export default App;
