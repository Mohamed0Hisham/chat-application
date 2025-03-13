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
				error: "Search by either email or fullname, not both.",
			});
		}

		if (!email && !fullname) {
			return res.status(400).json({
				success: false,
				error: "Please provide a valid email or fullname.",
			});
		}

		let query = { _id: { $ne: currentUserId } }; // Exclude current user
		const projection = { _id: 1, fullname: 1, avatar: 1 };

		let sort = {};
		if (email) {
			if (!validator.isEmail(email)) {
				return res.status(400).json({
					success: false,
					error: "Invalid email format.",
				});
			}
			query.email = email;
		} else {
			if (validator.isEmpty(fullname)) {
				return res.status(400).json({
					success: false,
					error: "Fullname cannot be empty.",
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
			error: error.message || "Server error processing your request.",
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
				error: "invalid credentials",
			});
		}

		const hashedPassword = await bcryptjs.hash(password, SALT);
		const user = {
			fullname,
			email,
			password: hashedPassword,
		};

		const result = await User.create(user);
		return res.status(201).json({
			success: true,
			message: "user created",
			data: {
				userID: result._id,
				fullname: result.fullname,
				email: result.email,
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: error.message,
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
				error: "invalid credentials",
			});
		}
		const user = await User.findOne({ email })
			.select("_id fullname email")
			.lean();
		if (!user) {
			return res.status(400).json({
				success: false,
				error: "make sure your credentials are correct",
			});
		}

		const accessToken = await generateAccessToken(user);
		const refreshToken = await generateRefreshToken(user);

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: environment,
			sameSite: "Strict",
			path: "/api/auth/refresh",
		});

		return res.status(200).json({
			success: true,
			message: "Login in successfully",
			accessToken,
			user,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: error.message,
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
				error: "User not found",
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
			error: error.message,
		});
	}
};

export const updateProfile = async (req, res) => {
	try {
		if (!req.body) {
			return res.status(400).json({
				success: false,
				error: "invalid operation",
			});
		}

		if (req.body.password) {
			if (validator.isLength(password, { min: 6 }) == false) {
				return res.status(400).json({
					success: false,
					error: "invalid operation",
				});
			}
			const hashedPassword = bcryptjs.hash(password, SALT);
			req.body.password = hashedPassword;
		}

		const userID = req.user._id;
		const result = await User.findByIdAndUpdate(userID, req.body, {
			new: true,
		});
		if (!result) {
			return res.status(400).json({
				success: false,
				error: "invalid operation",
			});
		}

		const { password, ...rest } = result._doc;
		return res.status(200).json({
			success: true,
			message: "user profile updated",
			data: rest,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};
