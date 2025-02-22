import { validateData, checkConversationMembership } from "./middlewares.js";

export const joinConversation = [
	validateData(["chatID", "userID"]),
	(socket, data, next) => {
		socket.join(data.chatID);
		socket.to(data.chatID).emit("userJoined", data.userID);
		next();
	},
];

export const sendMessage = [
	validateData(["chatID", "senderID", "content"]),
	checkConversationMembership,
	async (socket, data, next) => {
		try {
			// await saveMessageToDB(data);
			socket.server.to(data.chatID).emit("receiveMessage", data);
			next();
		} catch (err) {
			next(new Error("Failed to send message"));
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
