import { Server } from "socket.io";
import { authenticate } from "./middlewares.js";
import {
	joinConversation,
	sendMessage,
	typing,
	leaveConversation,
} from "./handlers.js";

export function initializeSocket(httpServer) {
	const io = new Server(httpServer);

	// Apply authentication middleware
	io.use(authenticate);

	io.on("connection", (socket) => {
		console.log(`User ${socket.userID} connected`);

		// Register event handlers directly
		socket.on("joinConversation", (data, acknowledge) =>
			joinConversation(socket, data, acknowledge)
		);
		socket.on("sendMessage", (data, acknowledge) =>
			sendMessage(socket, data, acknowledge)
		);
		socket.on("typing", (data, acknowledge) =>
			typing(socket, data, acknowledge)
		);
		socket.on("leaveConversation", (data, acknowledge) =>
			leaveConversation(socket, data, acknowledge)
		);
	});

	return io;
}
