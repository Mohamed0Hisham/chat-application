import { Outlet } from "react-router-dom";
import useAuthStore from "./store/Auth-Store";
import AppLoader from "./services/Loader";
import Loader from "./components/shared/Loader";
const App = () => {
	const { isLoggingOut } = useAuthStore();

	return (
		<>
			<AppLoader>
					<Outlet />
				{isLoggingOut && <div className="overlay"><Loader /></div> }
			</AppLoader>
		</>
	);
};

export default App;
