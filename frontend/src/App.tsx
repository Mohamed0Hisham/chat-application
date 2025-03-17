import { Outlet } from "react-router-dom";
import useAuthStore from "./store/Auth-Store";
import Loader from "./components/shared/Loader";
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
