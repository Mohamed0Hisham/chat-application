import jwt from "jsonwebtoken";

export const authenticate = (socket, next) => {
	const token = socket.handshake.auth.token;
	if (!token) return next(new Error("Authentication required"));

	try {
		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
		socket.userID = decoded.userID;
		next();
	} catch (error) {
		return next(new Error("Invalid token"));
	}
};
