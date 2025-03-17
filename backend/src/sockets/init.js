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

	io.use(authenticate);

	io.on("connection", (socket) => {
		console.log(`User ${socket.userID} connected`);

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
	socket.on("disconnect", () => {
		for (const room of socket.rooms) {
			if (room !== socket.id) {
				// Exclude the socket's own room
				socket.to(room).emit("userLeft", socket.userID);
			}
		}
	});

	return io;
}
