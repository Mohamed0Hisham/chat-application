import jwt from "jsonwebtoken";

export const generateAccessToken = async (user) => {
	const token = jwt.sign(
		{ id: user._id, email: user.email, fullname: user.fullname },
		process.env.JWT_ACCESS_SECRET,
		{ expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
	);
	return token;
};
export const generateRefreshToken = async (user) => {
	const token = jwt.sign(
		{ id: user._id, email: user.email, fullname: user.fullname },
		process.env.JWT_REFRESH_SECRET,
		{ expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
	);
	return token;
};
export const isAuthenticated = async (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) {
		return res.status(401).json({
			success: false,
			message: "missing token within request header",
		});
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
		req.user = decoded;
		return next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message:
				error.name === "TokenExpiredError"
					? "Token expired"
					: "Invalid token",
		});
	}
};
