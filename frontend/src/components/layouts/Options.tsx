import { Link } from "react-router-dom";
import styles from "./Options.module.css";
import { MessageSquare, Users, Plus, User, LucideChevronLeftCircle } from "lucide-react";

const Options = () => {
	return (
		<ul className={styles.options}>
			<li aria-label="Chat section">
				<MessageSquare className={styles.icon} />
				chat
			</li>
			<li aria-label="Groups section">
				<Users className={styles.icon} />
				groups
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
			<li aria-label="My profile">
				<User className={styles.icon} />
				me
			</li>
		</ul>
	);
};

export default Options;
