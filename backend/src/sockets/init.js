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

	const registerHandlers = (socket) => {
		const register = (event, handlers) => {
			socket.on(event, (data, acknowledge) => {
				const runner =
					(index = 0) =>
					(err) => {
						if (err) return acknowledge?.({ error: err.message });
						if (index < handlers.length) {
							handlers[index](socket, data, runner(index + 1));
						} else {
							acknowledge?.({ success: true });
						}
					};
				runner()();
			});
		};

		register("joinConversation", joinConversation);
		register("sendMessage", sendMessage);
		register("typing", typing);
		register("leaveConversation", leaveConversation);
	};

	io.on("connection", (socket) => {
		console.log(`User ${socket.userID} connected`);
		registerHandlers(socket);
	});

	return io;
}
