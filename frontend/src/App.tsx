import { Outlet } from "react-router-dom";
import useAuthStore from "./store/Auth-Store";
import AppLoader from "./services/Loader";
const App = () => {
	const { isLoggingOut } = useAuthStore();

	return (
		<>
			<AppLoader>
				<Outlet />
				{isLoggingOut && (
					<div className="logout-overlay">
						<p>Logging out...</p>
					</div>
				)}
			</AppLoader>
		</>
	);
};

export default App;
