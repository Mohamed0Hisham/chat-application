import Conversation from "../../components/friends/Conversation";
import useFriendStore from "../../store/friend";
import styles from "./chat.module.css";

const Chat = () => {
	const { friend } = useFriendStore();
	return (
		<main className={styles.chat}>
			{friend ? (
				<Conversation />
			) : (
				<div className={styles.noFriendSelected}>
					<p>Select a friend to start a conversation</p>
				</div>
			)}
		</main>
	);
};

export default Chat;
