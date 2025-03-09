// Chat.tsx
import { useState, FC } from "react";
// import { SenderBubble } from "../../components/chat/SenderBubble";
// import { ReceiverBubble } from "../../components/chat/ReceiverBubble";
import styles from "./Conversation.module.css";
import { Paperclip, SendHorizonal, Smile } from "lucide-react";
import { MessageInput } from "../../components/chat/MessageInput";

const src = "https://img.icons8.com/?size=100&id=11730&format=png&color=000000";
const user = {
	fullname: "mohamed hisham",
	isOnline: true,
	avatar: src,
};
const Chat: FC = () => {
	const [message, setMessage] = useState("");
	const [friend, setFriend] = useState(user);
	return (
		<div className={styles.conv}>
			<div className={styles.friend}>
				<div className={styles.avatar}>
					<img src={friend.avatar} alt="avatar" />
				</div>
				<div className={styles.description}>
					<p>{friend.fullname}</p>
					{friend.isOnline ? (
						<div className={styles.green}></div>
					) : (
						<div className={styles.red}></div>
					)}
				</div>
			</div>
			<div className={styles.chatContainer}>{}</div>
			<div className={styles.msgIn}>
				<span className={styles.attach}>
					<Paperclip className={styles.attachIcon} />
				</span>
				<MessageInput
					value={message}
					onChange={setMessage}
					placeholder="Type your message here..."
				/>
				<span className={styles.smile}>
					<Smile className={styles.smileIcon} />
				</span>
				<span className={styles.send}>
					<SendHorizonal className={styles.sendIcon} />
				</span>
			</div>
		</div>
	);
};

export default Chat;
