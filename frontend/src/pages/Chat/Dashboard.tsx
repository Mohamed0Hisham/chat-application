import Navigation from "../../components/layouts/Navigation";
import FriendsPanel from "../../components/layouts/FriendsPanel";
import styles from "./dashboard.module.css";

const Dashboard = () => {
	return (
		<div className={styles.container}>
			<nav className={styles.navigation}>
				<Navigation />
			</nav>

			<aside className={styles.friendsPanel}>
				<FriendsPanel />
			</aside>
		</div>
	);
};

export default Dashboard;
