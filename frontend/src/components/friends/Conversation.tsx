import { useState, FC, useEffect, useRef } from "react";
import styles from "./conversation.module.css";
import { Paperclip, SendHorizonal, Smile } from "lucide-react";
import { MessageInput } from "../chat/MessageInput";
import useMsgStore from "../../store/chat";
import useAuthStore from "../../store/Auth-Store";
import EmojiPicker from "../chat/EmojiPicker";
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
	const emojiPickerRef = useRef<HTMLDivElement>(null);

	// Toggle emoji picker visibility
	const toggleEmojiPicker = () => setShowEmojiPicker((prev) => !prev);

	// Close emoji picker when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				emojiPickerRef.current &&
				!emojiPickerRef.current.contains(event.target as Node)
			) {
				setShowEmojiPicker(false);
			}
		};

		if (showEmojiPicker) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showEmojiPicker]);

	// Send message function
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
			console.error("Failed to send message:", error);
			useMsgStore.setState((state) => ({
				messages: state.messages.filter((msg) => msg._id !== tempId),
			}));
		} finally {
			setIsSending(false);
		}
	};

	// Handle emoji selection
	const handleEmojiClick = (emoji: string) => {
		setContent((prev) => prev + emoji);
	};

	// Load older messages when scrolling to top
	const handleLoadMore = async () => {
		if (!isLoading) {
			const scrollHeightBefore =
				chatContainerRef.current?.scrollHeight || 0;
			loadMoreMessages();
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

	// Fetch messages when component mounts
	useEffect(() => {
		(async () => {
			try {
				await getMsgsOfChat();
			} catch (error) {
				console.error("Error fetching messages:", error);
			}
		})();
	}, [getMsgsOfChat]);

	// Scroll to bottom when new messages arrive
	useEffect(() => {
		if (chatContainerRef.current && !isLoading) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [messages, isLoading]);

	// Show "Load More" button when scrolled to top
	useEffect(() => {
		const handleScroll = () => {
			if (chatContainerRef.current) {
				const { scrollTop } = chatContainerRef.current;
				setShowLoadMore(scrollTop === 0 && page > 0 && !isLoading);
			}
		};

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
				<span className={styles.smile} onClick={toggleEmojiPicker}>
					<Smile className={styles.smileIcon} />
				</span>
				{showEmojiPicker && (
					<div className={styles.emojiPicker} ref={emojiPickerRef}>
						<EmojiPicker
							onSelect={handleEmojiClick}
							onClose={() => setShowEmojiPicker(false)}
						/>
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
