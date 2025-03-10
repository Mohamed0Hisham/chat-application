import Sidebar from "../../components/layouts/sidebar";
import styles from "./dashboard.module.css";
import Conversation from "./Conversation";
import useFriendStore from "../../store/friend";
const Dashboard = () => {
	const { friend } = useFriendStore();
	return (
		<section className={styles.container}>
			<ul className={styles.options}>
				<li>chat</li>
				<li>groups</li>
				<li>add</li>
				<li>me</li>
			</ul>
			<aside className={styles.sidebar}>
				<Sidebar />
			</aside>
			<main className={styles.chat}>
				{friend ? (
					<Conversation />
				) : (
					<p>select a friend to start conversation</p>
				)}
			</main>
		</section>
	);
};

export default Dashboard;
