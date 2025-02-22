import jwt from "jsonwebtoken";

export const authenticate = (socket, next) => {
	const token = socket.handshake.auth.token;
	if (!token) return next(new Error("Authentication required"));

	try {
		const decoded = jwt.verify(token, process.env.JWT_SOCKET_SECRET);
		socket.userID = decoded.userID;
		next();
	} catch (error) {
		return next(new Error("Invalid token"));
	}
};

export const validateData = (requiredFields) => (socket, data, next) => {
	for (const field of requiredFields) {
		if (!data[field]) return next(new Error(`Missing ${field}`));
	}
	next();
};

export const checkConversationMembership = (socket, data, next) => {
	if (socket.rooms.has(data.chatID)) return next();
	next(new Error("Not in conversation"));
};
