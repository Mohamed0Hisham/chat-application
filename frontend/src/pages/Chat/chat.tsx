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
				<p>select a friend to start conversation</p>
			)}
		</main>
	);
};

export default Chat;
