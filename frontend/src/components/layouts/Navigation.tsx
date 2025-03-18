import { Link } from "react-router-dom";
import styles from "./navigation.module.css";
import {
	MessageSquare,
	Plus,
	User,
	LucideChevronLeftCircle,
	LogOut,
} from "lucide-react";
import useAuthStore from "../../store/Auth-Store";

const Navigation = () => {
	const { logout } = useAuthStore();

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error(
				error instanceof Error
					? error.message
					: "Logout failed. Please try again."
			);
		}
	};

	return (
		<ul className={styles.options}>
			<li aria-label="Chat section">
				<MessageSquare className={styles.icon} />
				chat
			</li>
			<Link to="/requests" className={styles.link}>
				<li aria-label="see friends requests">
					<LucideChevronLeftCircle className={styles.icon} />
					Requests
				</li>
			</Link>
			<Link to="/add" className={styles.link}>
				<li aria-label="Add friends or chats">
					<Plus className={styles.icon} />
					add
				</li>
			</Link>
			<Link to={"/profile"} className={styles.link}>
				<li aria-label="My profile">
					<User className={styles.icon} />
					me
				</li>
			</Link>
			<li aria-label="My profile" onClick={handleLogout}>
				<LogOut className={styles.icon} />
				Logout
			</li>
		</ul>
	);
};

export default Navigation;
