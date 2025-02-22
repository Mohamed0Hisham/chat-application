import jwt from "jsonwebtoken";
import { generateAccessToken } from "./auth.js";

export const refreshToken = (req, res) => {
	const refreshToken = req.cookies.refreshToken;

	if (!refreshToken)
		return res
			.status(401)
			.json({ success: false, message: "Unauthorized" });

	try {
		const decoded = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET
		);

		const newAccessToken = generateAccessToken(decoded);
		return res.json({ accessToken: newAccessToken });
	} catch (error) {
		return res.status(403).json({ success: false, message: "forbidden" });
	}
};
