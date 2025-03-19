import validator from "validator";
import User from "./models.js";
import bcryptjs from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../../utils/auth.js";

const SALT = 12;
const environment = process.env.ENVIRONMENT === "production";

// const invalidateRefreshToken = async (userId) => {
// 	try {
// 		// Update user document to remove refresh token
// 		await User.findByIdAndUpdate(userId, {
// 			$unset: { refreshToken: 1 }, // Removes the refreshToken field
// 		});
// 	} catch (error) {
// 		console.error("Error invalidating refresh token:", error);
// 		throw new Error("Failed to invalidate session");
// 	}
// };

export const findUsers = async (req, res) => {
	try {
		const { email: rawEmail, fullname: rawFullName } = req.query;
		const currentUserId = req.user._id;
		console.log(req.user);

		const email = rawEmail?.trim().toLowerCase();
		const fullname = rawFullName?.trim().replace(/\s+/g, " ");

		if (email && fullname) {
			return res.status(400).json({
				success: false,
				message: "Search by either email or fullname, not both.",
			});
		}

		if (!email && !fullname) {
			return res.status(400).json({
				success: false,
				message: "Please provide a valid email or fullname.",
			});
		}

		let query = { _id: { $ne: currentUserId } }; // Exclude current user
		const projection = { _id: 1, fullname: 1, avatar: 1 };

		let sort = {};
		if (email) {
			if (!validator.isEmail(email)) {
				return res.status(400).json({
					success: false,
					message: "Invalid email format.",
				});
			}
			query.email = email;
		} else {
			if (validator.isEmpty(fullname)) {
				return res.status(400).json({
					success: false,
					message: "Fullname cannot be empty.",
				});
			}
			// query.$text = { $search: fullname };
			query.$text = { $search: `"${fullname}"` };
			projection.score = { $meta: "textScore" };
			sort = { score: { $meta: "textScore" } };
		}

		const users = await User.find(query, projection)
			.sort(sort)
			.limit(20)
			.lean();

		// Add to successful search response
		console.info(`User search: ${email || fullname} by ${currentUserId}`);
		return res.status(200).json({
			success: true,
			results: users,
		});
	} catch (error) {
		console.error("Search Error:", error.message);
		return res.status(500).json({
			success: false,
			message: error.message || "Server error processing your request.",
		});
	}
};

export const registerUser = async (req, res) => {
	try {
		const { fullname, email, password } = req.body;
		if (
			validator.isEmail(email) == false ||
			validator.isEmpty(fullname) == true ||
			validator.isLength(password, { min: 6 }) == false
		) {
			return res.status(400).json({
				success: false,
				message: "invalid credentials",
			});
		}

		const hashedPassword = await bcryptjs.hash(password, SALT);
		const user = {
			fullname,
			email,
			password: hashedPassword,
		};

		await User.create(user);
		return res.status(201).json({
			success: true,
			message: "user created",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (
			validator.isEmail(email) == false ||
			validator.isLength(password, { min: 6 }) == false
		) {
			return res.status(400).json({
				success: false,
				message: "invalid credentials",
			});
		}
		const user = await User.findOne({ email })
			.select("-__V -password")
			.lean();
		if (!user) {
			return res.status(400).json({
				success: false,
				message: "make sure your credentials are correct",
			});
		}

		const accessToken = await generateAccessToken(user);
		const refreshToken = await generateRefreshToken(user);

		const formattedUser = {
			_id: user._id,
			avatar: user.avatar,
			fullname: user.fullname,
			email: user.email,
			createdAt: user.createdAt,
			friendsCount: user.friends ? user.friends.length : 0,
			groupsCount: user.groups ? user.groups.length : 0,
		};

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: false,
			sameSite: "Strict",
			path: "/api/auth/refresh",
		});

		return res.status(200).json({
			success: true,
			message: "Login in successfully",
			accessToken,
			user: formattedUser,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
export const logout = async (req, res) => {
	// const userId = req.user._id;

	// await invalidateRefreshToken(userId);

	res.clearCookie("refreshToken", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "Strict",
		path: "/api/auth/refresh",
	});
	return res
		.status(200)
		.json({ success: true, message: "Logged out successfully" });
};

export const fetchProfile = async (req, res) => {
	try {
		const userID = req.user._id;

		// Fetch the user document
		const user = await User.findById(userID, {
			__v: 0,
			updatedAt: 0,
			password: 0, // Exclude the password field
		}).lean();

		if (!user) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const formattedUser = {
			avatar: user.avatar,
			fullname: user.fullname,
			email: user.email,
			joinDate: user.createdAt,
			friendsCount: user.friends ? user.friends.length : 0,
			groupsCount: user.groups ? user.groups.length : 0,
		};

		return res.status(200).json({
			success: true,
			message: "User profile fetched",
			user: formattedUser,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const updateProfile = async (req, res) => {
	try {
		const { password, ...rest } = req.body;

		if (!req.body) {
			return res.status(400).json({
				success: false,
				message: "invalid operation",
			});
		}

		if (password && password.length > 0) {
			if (validator.isLength(password, { min: 6 }) === false) {
				return res.status(400).json({
					success: false,
					message: "Password must be at least 6 characters long",
				});
			}
			const hashedPassword = await bcryptjs.hash(password, SALT);
			req.body.password = hashedPassword;
		}

		const userID = req.user._id;
		const result = await User.findByIdAndUpdate(userID, req.body, {
			new: true,
		}).lean();

		if (!result) {
			return res.status(400).json({
				success: false,
				message: "User not found",
			});
		}

		const formattedUser = {
			avatar: result.avatar,
			fullname: result.fullname,
			email: result.email,
			joinDate: result.createdAt,
			friendsCount: result.friends ? result.friends.length : 0,
			groupsCount: result.groups ? result.groups.length : 0,
		};

		return res.status(200).json({
			success: true,
			message: "User profile updated",
			user: formattedUser,
		});
	} catch (error) {
		console.error("Update Profile Error:", error);
		return res.status(500).json({
			success: false,
			message: error.message || "Internal server error",
		});
	}
};
