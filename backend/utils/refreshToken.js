import jwt from "jsonwebtoken";
import { generateAccessToken } from "./auth.js";

export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		const decoded = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET
		);

		const newAccessToken = await generateAccessToken(decoded);
		return res.json({ accessToken: newAccessToken });
	} catch (error) {
		return res.status(403).json({ success: false, message: error.message });
	}
};
