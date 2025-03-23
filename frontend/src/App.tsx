import { Outlet } from "react-router-dom";
import useAuthStore from "./store/auth";
import Loader from "./pages/shared/Loader";
const App = () => {
	const { isLoggingOut } = useAuthStore();

	return (
		<>
			<Outlet />
			{isLoggingOut && (
				<div className="overlay">
					<Loader />
				</div>
			)}
		</>
	);
};

export default App;
