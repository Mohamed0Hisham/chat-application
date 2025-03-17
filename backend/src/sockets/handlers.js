import { saveMessage } from "../messages/messageService.js";
import Msg from "../messages/models.js";

export const joinConversation = async (socket, data, acknowledge) => {
	const { chatID, userID } = data;

	if (!chatID || !userID) {
		return acknowledge?.({ error: "Missing chatID or userID" });
	}

	socket.join(chatID);
	socket.to(chatID).emit("userJoined", userID);

	// Fetch all/unread messages
	const unreadMessages = await Msg.find({
		chatID,
		receiverID: userID,
	}).lean();

	unreadMessages.forEach((msg) => {
		socket.emit("receiveMessage", msg);
	});

	acknowledge?.({ success: true });
};

export const sendMessage = async (socket, data, acknowledge) => {
	const { chatID, senderID, content } = data;
	console.log(data)

	// Basic validation
	if (!chatID || !senderID || !content) {
		return acknowledge?.({ error: "Missing required fields" });
	}

	// Ensure the user is in the chat room
	if (!socket.rooms.has(chatID)) {
		return acknowledge?.({ error: "Not in conversation" });
	}

	try {
		const msg = await saveMessage(chatID, senderID, content);
		// Emit the message to all clients in the room
		socket.server.to(chatID).emit("receiveMessage", msg);
		acknowledge?.({ success: true });
	} catch (err) {
		acknowledge?.({ error: err.message });
	}
};

export const typing = async (socket, data, acknowledge) => {
	const { chatID, userID } = data;

	// Validation
	if (!chatID || !userID) {
		return acknowledge?.({ error: "Missing required fields" });
	}

	// Membership check
	if (!socket.rooms.has(chatID)) {
		return acknowledge?.({ error: "Not in conversation" });
	}

	socket.broadcast.to(chatID).emit("typing", data);
	acknowledge?.({ success: true });
};

export const leaveConversation = async (socket, data, acknowledge) => {
	const { chatID, userID } = data;

	// Validation
	if (!chatID || !userID) {
		return acknowledge?.({ error: "Missing required fields" });
	}

	socket.leave(chatID);
	socket.to(chatID).emit("userLeft", userID);
	acknowledge?.({ success: true });
};
