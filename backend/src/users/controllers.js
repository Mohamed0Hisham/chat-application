import validator from "validator";
import User from "./models.js";
import bcryptjs from "bcryptjs";
import { startSession } from "mongoose";
import { generateAccessToken, generateRefreshToken } from "../../utils/auth.js";

const SALT = 12;
const environment = process.env.ENVIRONMENT === "production";
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
export const logout = (req, res) => {
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
		const { userID } = req.params;
		if (validator.isMongoId(userID) == false) {
			return res.status(400).json({
				success: false,
				error: "invalid credentials",
			});
		}
		const user = await User.findById(userID, {
			_id: 1,
			fullname: 1,
			email: 1,
			friends: 1,
		}).lean();
		if (!user) {
			return res.status(400).json({
				success: false,
				error: "user not found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "user profile fetched",
			data: user,
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

		const { userID } = req.params;
		if (validator.isMongoId(userID) == false) {
			return res.status(400).json({
				success: false,
				error: "invalid credentials",
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
