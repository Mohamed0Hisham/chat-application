import Navigation from "./Components/Navigation";
import FriendsPanel from "./Components/FriendsPanel";
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
