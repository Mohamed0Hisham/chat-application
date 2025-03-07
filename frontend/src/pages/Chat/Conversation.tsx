// Chat.tsx
import React, { useState } from "react";
import { SenderBubble } from "../../components/chat/SenderBubble";
import { ReceiverBubble } from "../../components/chat/ReceiverBubble";
import styles from "./Conversation.module.css";
import { Paperclip, SendHorizonal, Smile } from "lucide-react";
import { MessageInput } from "../../components/chat/MessageInput";

const Chat: React.FC = () => {
	const [message, setMessage] = useState("");
	return (
		<div className={styles.conv}>
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
					message="Doing great! Want to grab coffee later?"
					timestamp="10:32 AM"
				/>
				<SenderBubble
					message="Sure, sounds perfect!"
					timestamp="10:33 AM"
				/>
				<ReceiverBubble
					message="Doing great! Want to grab coffee later?"
					timestamp="10:32 AM"
				/>
				<SenderBubble
					message="Sure, sounds perfect!"
					timestamp="10:33 AM"
				/>
				<ReceiverBubble
					message="Doing great! Want to grab coffee later?"
					timestamp="10:32 AM"
				/>
				<SenderBubble
					message="Sure, sounds perfect!"
					timestamp="10:33 AM"
				/>
				<ReceiverBubble
					message="Doing great! Want to grab coffee later?"
					timestamp="10:32 AM"
				/>
				<SenderBubble
					message="Sure, sounds perfect!"
					timestamp="10:33 AM"
				/>
				<ReceiverBubble
					message="Doing great! Want to grab coffee later?"
					timestamp="10:32 AM"
				/>
			</div>
			<div className={styles.msgIn}>
				<span className={styles.attach}>
					<Paperclip className={styles.attachIcon}/>
				</span>
				<MessageInput
					value={message}
					onChange={setMessage}
					placeholder="Type your message here..."
				/>
				<span className={styles.smile}>
					<Smile className={styles.smileIcon}/>
				</span>
				<span className={styles.send}>
					<SendHorizonal className={styles.sendIcon}/>
				</span>
			</div>
		</div>
	);
};

export default Chat;
