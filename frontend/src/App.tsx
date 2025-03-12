import { Outlet } from "react-router-dom";
import useAuthStore from "./store/Auth-Store";
const App = () => {
	const { isLoggingOut } = useAuthStore();

	return (
		<>
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
