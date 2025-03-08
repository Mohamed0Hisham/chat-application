// Chat.tsx
import { useState, FC } from "react";
import { SenderBubble } from "../../components/chat/SenderBubble";
import { ReceiverBubble } from "../../components/chat/ReceiverBubble";
import styles from "./Conversation.module.css";
import { Paperclip, SendHorizonal, Smile } from "lucide-react";
import { MessageInput } from "../../components/chat/MessageInput";

const src = "https://img.icons8.com/?size=100&id=11730&format=png&color=000000";
const Chat: FC = () => {
	const [message, setMessage] = useState("");
	return (
		<div className={styles.conv}>
			<div className={styles.friend}>
				<div className={styles.avatar}>
					<img src={src} alt="avatar" />
				</div>
				<div className={styles.description}>
					<p>your friend</p>
					{true ? (
						<div className={styles.green}></div>
					) : (
						<div className={styles.red}></div>
					)}
				</div>
			</div>
			<div className={styles.chatContainer}>
				<ReceiverBubble
					message="Hey! How's it going?"
					timestamp="10:30 AM"
				/>
				<SenderBubble
					message="Pretty good, thanks! How about you?"
					timestamp="10:31 AM"
				/>
				<ReceiverBubble
					message="Hey! How's it going?"
					timestamp="10:30 AM"
				/>
				<SenderBubble
					message="Pretty good, thanks! How about you?"
					timestamp="10:31 AM"
				/>
				<ReceiverBubble
					message="Hey! How's it going?"
					timestamp="10:30 AM"
				/>
				<SenderBubble
					message="Pretty good, thanks! How about you?"
					timestamp="10:31 AM"
				/>
				<ReceiverBubble
					message="Hey! How's it going?"
					timestamp="10:30 AM"
				/>
				<SenderBubble
					message="Pretty good, thanks! How about you?"
					timestamp="10:31 AM"
				/>
				<ReceiverBubble
					message="Hey! How's it going?"
					timestamp="10:30 AM"
				/>
				<SenderBubble
					message="Pretty good, thanks! How about you?"
					timestamp="10:31 AM"
				/>
			</div>
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
