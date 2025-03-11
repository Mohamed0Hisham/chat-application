import { startSession } from "mongoose";
import validator from "validator";
import User from "../users/models.js";

export const fetchRequests = async (req, res) => {
	try {
		const user = req.user;

		const result = await User.findById(user._id, {
			requests: 1,
			_id: 0,
		})
			.populate("requests", " -_id fullname email createdAt")
			.lean();

		return res.status(200).json({
			success: true,
			message: "requests fetched",
			requests: result.requests,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
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
			.populate("friends", "_id fullname isOnline")
			.lean();
		if (!user) {
			return res.status(404).json({
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
export const fetchFriend = async (req, res) => {
	try {
		const { userID, friendID } = req.params;
		if (
			validator.isMongoId(userID) == false ||
			validator.isMongoId(friendID) == false
		) {
			return res.status(400).json({
				success: false,
				error: "invalid ID format",
			});
		}

		const user = await User.findById(userID)
			.populate("friends", "_id fullname isOnline")
			.lean();
		if (!user) {
			return res.status(404).json({
				success: false,
				error: "user not found",
			});
		}

		const friend = user.friends.find(
			(ob) => ob._id.toString() === friendID
		);

		if (!friend) {
			return res.status(404).json({
				success: false,
				error: "Friend not found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Friend fetched successfully",
			data: friend,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: error.message,
		});
	}
};
export const sendFriendRequest = async (req, res) => {
	const session = await startSession();
	session.startTransaction();
	try {
		const userID = req.user._id;
		const { friendID } = req.params;

		if (!validator.isMongoId(friendID)) {
			return res.status(400).json({
				success: false,
				error: "Invalid ID",
			});
		}

		if (userID === friendID) {
			return res.status(400).json({
				success: false,
				error: "Cannot send friend request to yourself",
			});
		}

		const friend = await User.findById(friendID).session(session);
		const user = await User.findById(userID).session(session);
		if (
			user.friends.includes(friendID) ||
			friend.friends.includes(userID)
		) {
			return res.status(400).json({
				success: false,
				error: "friend already added",
			});
		}

		await User.findByIdAndUpdate(
			friendID,
			{
				$addToSet: { requests: user._id },
			},
			{ session }
		);

		await session.commitTransaction();
		return res.status(200).json({
			success: true,
			message: "Friend request sent",
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
export const acceptFriend = async (req, res) => {
	const session = await startSession();
	session.startTransaction();

	try {
		const userID = req.user._id;
		const { friendID } = req.body;
		if (!validator.isMongoId(friendID)) {
			return res.status(400).json({
				success: false,
				error: "Invalid operation",
			});
		}

		const friend = await User.findById(friendID).session(session);
		const user = await User.findById(userID).session(session);

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
			message: "friend request accepted successfully",
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
