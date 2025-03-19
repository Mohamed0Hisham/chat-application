import { useEffect, useRef } from "react";
import Conversation from "../../components/friends/Conversation";
import styles from "./chat.module.css";
import { io, Socket } from "socket.io-client";
import useAuthStore from "../../store/Auth-Store";
import useMsgStore from "../../store/chat";

const Chat = () => {
	const { accessToken, user } = useAuthStore();
	const { chat } = useMsgStore();
	const socketRef = useRef<Socket | null>(null);

	// Socket initialization
	useEffect(() => {
		socketRef.current = io("http://localhost:7536", {
			auth: {
				token: accessToken,
			},
		});
		socketRef.current.on("connect", () => {
			console.log("Connected to server");
			console.log("Connected to server with ID:", socketRef?.current?.id);
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
			socketRef?.current?.disconnect();
		};
	}, [accessToken]);

	useEffect(() => {
		console.log(chat)
		console.log(user)
		console.log(socketRef.current)
		if (chat && user?._id && socketRef.current) {
			socketRef.current.emit(
				"joinConversation",
				{ chatID: chat, userID: user._id },
				(response: { success?: boolean; error?: string }) => {
					if (response && response.success) {
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
	}, [chat, user]);

	return (
		<main className={styles.chat}>
			{socketRef && <Conversation socket={socketRef.current} />}
		</main>
	);
};

export default Chat;
