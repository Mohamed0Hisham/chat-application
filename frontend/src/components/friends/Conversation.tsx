import { useState, FC } from "react";
import styles from "./conversation.module.css";
import { Paperclip, SendHorizonal, Smile } from "lucide-react";
import { MessageInput } from "../chat/MessageInput";
import useFriendStore from "../../store/friend";
import useMsgStore from "../../store/chat";
import useAuthStore from "../../store/Auth-Store";
import EmojiPicker from "emoji-picker-react";

const Conversation: FC = () => {
	const [content, setContent] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const { friend } = useFriendStore();
	const { isLoading, messages } = useMsgStore();
	const { user } = useAuthStore();

	const handleSend = async () => {
		if (!content.trim() || !user || isSending) return;
		setIsSending(true);
		const tempId = Date.now().toString();
		
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
		try {
			//Todo
			setContent("");
		} catch (error) {
			console.log("Failed to send message", error);
			useMsgStore.setState((state) => ({
				messages: state.messages.filter((msg) => msg._id !== tempId),
			}));
		} finally {
			setIsSending(false);
		}
	};

	const handleEmojiClick = (emoji: { emoji: string }) => {
		setContent((prev) => prev + emoji.emoji);
	};

	return (
		<div className={styles.conv}>
			{/* Friend Header */}
			<div className={styles.friendHeader}>
				<div className={styles.avatarContainer}>
					<img
						src={friend?.avatar}
						alt="avatar"
						className={styles.avatar}
					/>
					<div
						className={
							friend?.isOnline
								? styles.onlineIndicator
								: styles.offlineIndicator
						}></div>
				</div>
				<div className={styles.description}>
					<p className={styles.fullname}>{friend?.fullname}</p>
					<p className={styles.status}>
						{friend?.isOnline ? "Online" : "Offline"}
					</p>
				</div>
			</div>

			{/* Chat Container */}
			<div className={styles.chatContainer}>
				{isLoading ? (
					<p>Loading messages...</p>
				) : (
					messages.map((msg, index) => {
						const isSender = msg.senderID === user?._id;
						const previousMsg = messages[index - 1];
						const showAvatar =
							!isSender &&
							(!previousMsg ||
								previousMsg.senderID !== msg.senderID);
						return (
							<div
								key={msg._id}
								className={
									isSender
										? styles.senderMessage
										: styles.receiverMessage
								}>
								{showAvatar && (
									<img
										src={friend?.avatar}
										alt="avatar"
										className={styles.receiverAvatar}
									/>
								)}
								<div
									className={
										isSender
											? styles.senderBubble
											: styles.receiverBubble
									}>
									<span className={styles.message}>
										{msg.content}
									</span>
									<span className={styles.timestamp}>
										{new Date(
											msg.createdAt
										).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
								</div>
							</div>
						);
					})
				)}
			</div>

			{/* Message Input */}
			<div className={styles.msgIn}>
				<span className={styles.attach}>
					<Paperclip className={styles.attachIcon} />
				</span>
				<MessageInput
					value={content}
					onChange={setContent}
					placeholder="Type your message here..."
				/>
				<span
					className={styles.smile}
					onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
					<Smile className={styles.smileIcon} />
				</span>
				{showEmojiPicker && (
					<div className={styles.emojiPicker}>
						<EmojiPicker onEmojiClick={handleEmojiClick} />
					</div>
				)}
				<button
					className={styles.sendButton}
					onClick={handleSend}
					disabled={!content.trim() || isSending}>
					{isSending ? (
						"Sending..."
					) : (
						<SendHorizonal className={styles.sendIcon} />
					)}
				</button>
			</div>
		</div>
	);
};

export default Conversation;
