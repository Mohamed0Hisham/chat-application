import validator from "validator";
import User from "./models.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { startSession } from "mongoose";

const SALT = 12;
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
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				success: false,
				error: "make sure your credentials are correct",
			});
		}

		const { _id: userID, email: userEmail, fullname } = user;
		const token = jwt.sign({ userID, userEmail }, process.env.JWT_SECRET, {
			expiresIn: "15m",
		});

		return res.status(200).json({
			success: true,
			message: "Login in successfully",
			token,
			data: {
				userID,
				fullname,
				email,
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	}
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
export const fetchFriends = async (req, res) => {
	try {
		const { userID } = req.params;
		if (validator.isMongoId(userID) == false) {
			return res.status(400).json({
				success: false,
				error: "invalid credentials",
			});
		}

		const user = await User.findById(userID)
			.populate("friends", "_id fullname email")
			.lean();
		if (!user) {
			return res.status(400).json({
				success: false,
				error: "user not found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "friends list fetched",
			data: user.friends,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};

export const addFriend = async (req, res) => {
	const session = await startSession();

	try {
		session.startTransaction();

		const { userID } = req.params;
		const { friendID } = req.body;
		if (!validator.isMongoId(userID) || !validator.isMongoId(friendID)) {
			return res.status(400).json({
				success: false,
				error: "Invalid operation",
			});
		}

		const users = await User.find({ _id: { $in: [userID, friendID] } });
		if (users.length !== 2) {
			return res.status(400).json({
				success: false,
				error: "Invalid user or friend ID",
			});
		}
		const user = users.find((u) => u._id.toString() === userID);
		const friend = users.find((u) => u._id.toString() === friendID);

		if (
			user.friends.includes(friendID) ||
			friend.friends.includes(userID)
		) {
			return res.status(400).json({
				success: false,
				error: "friend already added",
			});
		}

		user.friends.push(friendID);
		friend.friends.push(userID);
		await User.bulkSave([user, friend], { session });

		await session.commitTransaction();
		return res.status(200).json({
			success: true,
			message: "friend added successfully",
			data: user.friends,
		});
	} catch (error) {
		await session.abortTransaction();
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	} finally {
		await session.endSession();
	}
};
export const deleteFriend = async (req, res) => {
	const session = await startSession();
	try {
		session.startTransaction();

		const { userID, friendID } = req.params;
		if (!validator.isMongoId(userID) || !validator.isMongoId(friendID)) {
			return res.status(400).json({
				success: false,
				error: "Invalid operation",
			});
		}

		const users = await User.find({ _id: { $in: [userID, friendID] } });
		if (users.length !== 2) {
			return res.status(400).json({
				success: false,
				error: "Invalid user or friend ID",
			});
		}
		const user = users.find((u) => u._id.toString() === userID);
		const friend = users.find((u) => u._id.toString() === friendID);

		const friendIndex = user.friends.indexOf(friendID);
		const userIndex = friend.friends.indexOf(userID);
		if (friendIndex === -1 || userIndex === -1) {
			return res.status(400).json({
				success: false,
				error: "friend not found",
			});
		}

		user.friends.splice(friendIndex, 1);
		friend.friends.splice(userIndex, 1);
		await User.bulkSave([user, friend], { session });

		await session.commitTransaction();
		return res.status(200).json({
			success: true,
			message: "friend deleted successfully",
			data: user.friends,
		});
	} catch (error) {
		await session.abortTransaction();
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	} finally {
		await session.endSession();
	}
};
