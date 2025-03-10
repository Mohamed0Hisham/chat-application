// Chat.tsx
import { useState, FC } from "react";
import { SenderBubble } from "../../components/chat/SenderBubble";
import { ReceiverBubble } from "../../components/chat/ReceiverBubble";
import styles from "./Conversation.module.css";
import { Paperclip, SendHorizonal, Smile } from "lucide-react";
import { MessageInput } from "../../components/chat/MessageInput";
import useFriendStore from "../../store/friend";
import api from "../../services/api";
import useMsgStore from "../../store/chat";
import { useAuth } from "../../hooks/useAuth";

const Chat: FC = () => {
	const [content, setContent] = useState("");
	const { friend } = useFriendStore();
	const { chat, isLoading, messages } = useMsgStore();
	const { user, token } = useAuth();
	return (
		<div className={styles.conv}>
			<div className={styles.friend}>
				<div className={styles.avatar}>
					<img src={friend?.avatar} alt="avatar" />
				</div>
				<div className={styles.description}>
					<p>{friend?.fullname}</p>
					{friend?.isOnline ? (
						<div className={styles.green}></div>
					) : (
						<div className={styles.red}></div>
					)}
				</div>
			</div>
			<div className={styles.chatContainer}>
				{isLoading
					? ""
					: messages.map((msg) => {
							if (msg.senderID === user?._id) {
								return (
									<SenderBubble
										key={msg._id}
										message={msg.content}
										timestamp={msg.createdAt.toISOString()}
									/>
								);
							} else {
								return (
									<ReceiverBubble
										key={msg._id}
										message={msg.content}
										timestamp={msg.createdAt.toISOString()}
									/>
								);
							}
					  })}
			</div>
			<div className={styles.msgIn}>
				<span className={styles.attach}>
					<Paperclip className={styles.attachIcon} />
				</span>
				<MessageInput
					value={content}
					onChange={setContent}
					placeholder="Type your message here..."
				/>
				<span className={styles.smile}>
					<Smile className={styles.smileIcon} />
				</span>
				<span
					className={styles.send}
					onClick={() => {
						if (!content.trim() || !user) return;
						const tempId = Date.now().toString();
						(async () => {
							try {
								useMsgStore.setState((state) => ({
									messages: [
										...state.messages,
										{
											_id: tempId,
											content,
											senderID: user._id,
											createdAt: new Date(),
										},
									],
								}));
								console.log(user)
								await api.post(
									`/messages/${chat}`,
									{
										senderID: user._id,
										content,
									},
									{
										headers: {
											Authorization: `Bearer ${token}`,
										},
									}
								);
								setContent("");
							} catch (error) {
								console.log("failed to send message", error);
								useMsgStore.setState((state) => ({
									messages: state.messages.filter(
										(msg) => msg._id !== tempId
									),
								}));
							}
						})();
					}}>
					<SendHorizonal className={styles.sendIcon} />
				</span>
			</div>
		</div>
	);
};

export default Chat;
