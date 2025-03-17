import { useEffect } from "react";
import Conversation from "../../components/friends/Conversation";
import useFriendStore from "../../store/friend";
import styles from "./chat.module.css";
import { io } from "socket.io-client";
import useAuthStore from "../../store/Auth-Store";

const Chat = () => {
	const { friend } = useFriendStore();
	const { accessToken } = useAuthStore();

	useEffect(() => {
		const socket = io("http://localhost:7536", {
			auth: {
				token: accessToken,
			},
		});

		socket.on("connect", () => {
			console.log("Connected to server");
		});

		socket.on("receiveMessage", (message) => {
			console.log("Received message:", message);
		});

		socket.on("disconnect", () => {
			console.log("Disconnected from server");
		});

		socket.on("connect_error", (error) => {
			console.error("Connection error:", error);
		});

		return () => {
			socket.disconnect();
		};
	}, [accessToken]);

	return (
		<main className={styles.chat}>
			{friend ? (
				<Conversation />
			) : (
				<div className={styles.noFriendSelected}>
					<p>Select a friend to start a conversation</p>
				</div>
			)}
		</main>
	);
};

export default Chat;
