import { saveMessage } from "../messages/messageService.js";
import Msg from "../messages/models.js";
import { validateData, checkConversationMembership } from "./middlewares.js";

export const joinConversation = [
	validateData(["chatID", "userID"]),
	async (socket, data, acknowledge) => {
		socket.join(data.chatID);
		socket.to(data.chatID).emit("userJoined", data.userID);

		// Fetch unread messages 
		const unreadMessages = await Msg.find({
			chatID,
			receiverID: userID,
		}).lean();

		unreadMessages.forEach((msg) => {
			socket.emit("receiveMessage", msg);
		});

		acknowledge?.({ success: true });
	},
];

export const sendMessage = [
	validateData(["chatID", "senderID", "content"]),
	checkConversationMembership,

	async (socket, data, acknowledge) => {
		const { chatID, senderID, content } = data;
		try {
			const msg = await saveMessage(chatID, senderID, content);

			socket.server.to(chatID).emit("receiveMessage", msg);
			acknowledge?.({ success: true });
		} catch (err) {
			acknowledge?.({ error: err.message });
		}
	},
];

export const typing = [
	validateData(["chatID", "userID"]),
	checkConversationMembership,
	(socket, data, next) => {
		socket.broadcast.to(data.chatID).emit("typing", data);
		next();
	},
];

export const leaveConversation = [
	validateData(["chatID", "userID"]),
	(socket, data, next) => {
		socket.leave(data.chatID);
		socket.to(data.chatID).emit("userLeft", data.userID);
		next();
	},
];
