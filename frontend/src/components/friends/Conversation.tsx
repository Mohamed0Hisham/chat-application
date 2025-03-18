import { useState, FC, useEffect, useRef } from "react";
import styles from "./conversation.module.css";
import { Paperclip, SendHorizonal, Smile } from "lucide-react";
import { MessageInput } from "../chat/MessageInput";
import useMsgStore from "../../store/chat";
import useAuthStore from "../../store/Auth-Store";
import EmojiPicker from "emoji-picker-react";
import { Socket } from "socket.io-client";
import { Msg } from "../../types/States";

interface ConversationProps {
	socket: Socket | null;
}

const Conversation: FC<ConversationProps> = ({ socket }) => {
	const [content, setContent] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [isSending, setIsSending] = useState(false);
	const [showLoadMore, setShowLoadMore] = useState(false);
	const { isLoading, messages, getMsgsOfChat, page, loadMoreMessages } =
		useMsgStore();
	const { user } = useAuthStore();
	const friend = useMsgStore.getState().friend;
	const chat = useMsgStore.getState().chat;
	const chatContainerRef = useRef<HTMLDivElement>(null);

	// Handle sending messages
	const handleSend = async () => {
		if (!content.trim() || !user || isSending || !socket) return;
		setIsSending(true);
		const tempId = Date.now().toString();

		const tempMessage: Msg = {
			_id: tempId,
			chatID: chat,
			senderID: user._id,
			content,
			createdAt: new Date(),
		};

		useMsgStore.setState((state) => ({
			messages: [...state.messages, tempMessage],
		}));

		try {
			await new Promise((resolve, reject) => {
				socket.emit(
					"sendMessage",
					{ chatID: chat, senderID: user._id, content },
					(response: {
						success: boolean;
						data?: Msg;
						error?: string;
					}) => {
						if (response.success && response.data) {
							useMsgStore.setState((state) => ({
								messages: state.messages.map((msg) =>
									msg._id === tempId ? response.data! : msg
								),
							}));
							resolve(true);
						} else {
							reject(
								new Error(
									response.error || "Failed to send message"
								)
							);
						}
					}
				);
			});
			setContent("");
		} catch (error) {
			console.error(
				"Failed to send message:",
				error instanceof Error ? error.message : error
			);
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

	const handleLoadMore = async () => {
		if (!isLoading) {
			const scrollHeightBefore =
				chatContainerRef.current?.scrollHeight || 0;
			await loadMoreMessages();
			// Maintain scroll position after loading older messages
			requestAnimationFrame(() => {
				if (chatContainerRef.current) {
					const scrollHeightAfter =
						chatContainerRef.current.scrollHeight;
					chatContainerRef.current.scrollTop =
						scrollHeightAfter - scrollHeightBefore;
				}
			});
		}
	};

	// Scroll handler to show/hide "Load More" button
	const handleScroll = () => {
		if (chatContainerRef.current) {
			const { scrollTop } = chatContainerRef.current;
			setShowLoadMore(scrollTop === 0 && page > 0 && !isLoading);
		}
	};

	// Initial fetch and scroll to bottom
	useEffect(() => {
		(async () => {
			try {
				await getMsgsOfChat();
			} catch (error) {
				console.log(
					error instanceof Error
						? error.message
						: "Unknown error while fetching chat messages"
				);
			}
		})();
	}, [getMsgsOfChat]);

	// Scroll to bottom when messages change (e.g., new message)
	useEffect(() => {
		if (chatContainerRef.current && !isLoading) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [messages, isLoading]);

	// Attach scroll listener
	useEffect(() => {
		const container = chatContainerRef.current;
		if (container) {
			container.addEventListener("scroll", handleScroll);
			return () => container.removeEventListener("scroll", handleScroll);
		}
	}, [page, isLoading]);

	return (
		<div className={styles.conv}>
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

			<div className={styles.chatContainer} ref={chatContainerRef}>
				{showLoadMore && (
					<button
						className={styles.loadMoreButton}
						onClick={handleLoadMore}>
						Load More Messages
					</button>
				)}
				{isLoading && page === 1 ? (
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
