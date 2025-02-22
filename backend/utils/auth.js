import jwt from "jsonwebtoken";

export const generateAccessToken = async (user) => {
	const token = jwt.sign(
		{ id: user._id, email: user.email },
		process.env.JWT_ACCESS_SECRET,
		{ expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
	);
	return token;
};
export const generateRefreshToken = async (user) => {
	const token = jwt.sign(
		{ id: user._id, email: user.email },
		process.env.JWT_REFRESH_SECRET,
		{ expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
	);
	return token;
};
