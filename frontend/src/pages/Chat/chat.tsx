import { useEffect, useRef, useState } from "react";
import Conversation from "./components/Conversation";
import styles from "./chat.module.css";
import { io, Socket } from "socket.io-client";
import useAuthStore from "../../store/auth";
import useMsgStore from "../../store/chat";
import Loader2 from "../shared/Loader2";

const Chat = () => {
	const { accessToken, user } = useAuthStore();
	const { chat } = useMsgStore();
	const [isConnecting, setIsConnecting] = useState(true);
	const socketRef = useRef<Socket | null>(null);

	// Socket initialization and joinConversation logic
	useEffect(() => {
		socketRef.current = io("http://localhost:7536", {
			auth: { token: accessToken },
			reconnection: true, // Enable reconnection
			reconnectionAttempts: 10, // Try reconnecting up to 10 times
			reconnectionDelay: 1000, // Start with 1s delay between attempts
			reconnectionDelayMax: 5000, // Max delay of 5s
			timeout: 10000, // Increase from default 20000ms to 10s for initial connection
			transports: ["websocket"], // Skip polling fallback
		});

		socketRef.current.on("connect", () => {
			setIsConnecting(false);
			if (chat && user?._id) {
				socketRef.current?.emit(
					"joinConversation",
					{ chatID: chat, userID: user._id },
					(response: { success?: boolean; error?: string }) => {
						if (response?.success) {
							console.log("Joined conversation successfully");
						} else {
							console.error(
								"Failed to join conversation:",
								response?.error
							);
						}
					}
				);
			}
		});

		socketRef.current.on("receiveMessage", (message) => {
			useMsgStore.getState().addMessage(message);
		});

		socketRef.current.on("disconnect", () => {
			console.log("Disconnected from server");
		});

		socketRef.current.on("connect_error", (error) => {
			console.error("Connection error:", error);
		});

		socketRef.current.on("reconnect_attempt", () => {
			console.log("Reconnection attempt...");
		});

		socketRef.current.on("reconnect_error", (error) => {
			console.error("Reconnection error:", error);
		});

		return () => {
			socketRef.current?.disconnect();
		};
	}, [accessToken, chat, user]); // Dependencies include chat and user

	return (
		<main className={styles.chat}>
			{isConnecting ? (
				<div className="overlay">
					<Loader2 />
				</div>
			) : (
				socketRef.current && <Conversation socket={socketRef.current} />
			)}
		</main>
	);
};

export default Chat;
