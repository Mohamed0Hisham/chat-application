// Dashboard.tsx - Updated layout container
import Sidebar from "../../components/layouts/sidebar";
import styles from "./dashboard.module.css";
import Options from "../../components/layouts/Options";

const Dashboard = () => {
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
