import styles from "./Options.module.css";
import { MessageSquare, Users, Plus, User } from "lucide-react";

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
			<li aria-label="Add friends or chats">
				<Plus className={styles.icon} />
				add
			</li>
			<li aria-label="My profile">
				<User className={styles.icon} />
				me
			</li>
		</ul>
	);
};

export default Options;
