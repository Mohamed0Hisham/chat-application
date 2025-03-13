// Dashboard.tsx - Updated layout container
import Sidebar from "../../components/layouts/sidebar";
import styles from "./dashboard.module.css";
import Options from "../../components/layouts/Options";
import useAuthStore from "../../store/Auth-Store";
import { useEffect } from "react";

const Dashboard = () => {
	const { getProfile } = useAuthStore();

	useEffect(() => {
		(async () => {
			try {
				await getProfile();
				
			} catch (error) {
				console.error("failed at dashboard", error.message)
			}
		})();
	}, [getProfile]);
	
	return (
		<section className={styles.container}>
			<Options />
			<aside className={styles.sidebar}>
				<Sidebar />
			</aside>
		</section>
	);
};

export default Dashboard;
