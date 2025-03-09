import validator from "validator";
import { startSession } from "mongoose";
import User from "../users/models.js";
import Chat from "./models.js";

export const createConversation = async (req, res) => {
	const session = await startSession();
	try {
		session.startTransaction();
		const { participants } = req.body;

		if (!Array.isArray(participants) || participants.length < 1) {
			return res.status(400).json({
				success: false,
				message: "Participants must be a non-empty array.",
			});
		}

		if (participants.length > 25) {
			return res.status(400).json({
				success: false,
				message: "Maximum number of participants exceeded",
			});
		}

		if (participants.some((userID) => !validator.isMongoId(userID))) {
			return res.status(400).json({
				success: false,
				message: "Invalid participant ID(s)",
			});
		}

		const users = await User.find({ _id: { $in: participants } }).session(
			session
		);
		if (users.length !== participants.length) {
			return res.status(404).json({
				success: false,
				message: "One or more participants not found",
			});
		}

		const duplicateChat = await Chat.findOne({ participants });
		if (duplicateChat) {
			return res.status(400).json({
				success: false,
				message: "there is a chat between these user already",
			});
		}

		const newChat = await Chat.insertOne({ participants }, { session });

		const updateOperations = participants.map((userID) => ({
			updateOne: {
				filter: { _id: userID },
				update: { $push: { conversation: newChat._id } },
			},
		}));
		await User.bulkWrite(updateOperations, { session });

		await session.commitTransaction();
		return res.status(201).json({
			success: true,
			message: "New chat created between users",
			data: {
				chatID: newChat._id,
				participants: users.map((user) => user.fullname),
			},
		});
	} catch (error) {
		await session.abortTransaction();
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	} finally {
		await session.endSession();
	}
};
export const fetchConversation = async (req, res) => {
	try {
		const { userID } = req.params;
		const { friendID } = req.query;
		if (!validator.isMongoId(userID) || !validator.isMongoId(friendID)) {
			return res.status(400).json({
				success: false,
				message: "invalid users Id",
			});
		}

		if (req.user._id.toString() !== userID) {
			return res.status(403).json({
				success: false,
				message: "unauthorized access",
			});
		}

		const user = await User.findById(userID).lean();
		const friend = await User.findById(friendID).lean();
		if (!user || !friend) {
			return res.status(404).json({
				success: false,
				message: "invalid id passed",
			});
		}

		const chatID = await Chat.findOne({
			participants: { $all: [userID, friendID] },
		})
			.select("_id")
			.lean();

		return res.status(200).json({
			success: true,
			message: "chat fetched",
			data: chatID,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message:
				process.env.NODE_ENV === "production"
					? "Server error"
					: error.message,
		});
	}
};
export const fetchGroupConversation = async (req, res) => {
	try {
		// Extract userIDs from query parameters (e.g., "id1,id2,id3")
		const { userIDs } = req.query;
		if (!userIDs) {
			return res.status(400).json({
				success: false,
				message: "userIDs query parameter is required",
			});
		}

		// Split into an array and ensure at least two users
		const ids = userIDs.split(",");
		if (ids.length < 2) {
			return res.status(400).json({
				success: false,
				message: "at least two user IDs are required for a group chat",
			});
		}

		// Validate each ID as a MongoDB ObjectId
		for (const id of ids) {
			if (!validator.isMongoId(id)) {
				return res.status(400).json({
					success: false,
					message: "invalid user ID",
				});
			}
		}

		// Check if all users exist in the database
		const users = await User.find({ _id: { $in: ids } }).lean();
		if (users.length !== ids.length) {
			return res.status(404).json({
				success: false,
				message: "one or more users not found",
			});
		}

		// Find a chat that includes all specified participants
		const chat = await Chat.findOne({
			participants: { $all: ids },
		}).lean();

		if (!chat) {
			return res.status(404).json({
				success: false,
				message: "no chat found with the specified participants",
			});
		}

		// Return the chat
		return res.status(200).json({
			success: true,
			message: "chat fetched successfully",
			data: chat,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "an error occurred while fetching the chat",
		});
	}
};
export const fetchUserConversations = async (req, res) => {
	try {
		const { userID } = req.params;
		if (!validator.isMongoId(userID)) {
			return res.status(400).json({
				success: false,
				message: "invalid chat Id",
			});
		}

		const user = await User.findById(userID)
			.populate("conversation")
			.lean();
		if (user.conversation.length < 1) {
			return res.status(204).end();
		}

		return res.status(200).json({
			success: true,
			message: "user chats fetched",
			data: user.conversation,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
export const updateConversationSetting = async (req, res) => {
	try {
		const { participants } = req.body;
		if (!Array.isArray(participants) || participants.length < 1) {
			return res.status(400).json({
				success: false,
				message: "missing participants",
			});
		}

		const set = new Set(participants);
		const uniqueUsers = [...set];

		const { chatID } = req.params;
		if (!validator.isMongoId(chatID)) {
			return res.status(400).json({
				success: false,
				message: "invalid chat Id",
			});
		}

		const update = await Chat.findByIdAndUpdate(
			chatID,
			{ participants: uniqueUsers },
			{ new: true }
		).lean();

		return res.status(200).json({
			success: true,
			message: "conversation participants have been updated",
			data: update,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
export const deleteConversation = async (req, res) => {
	const session = await startSession();
	try {
		session.startTransaction();

		const { chatID } = req.params;
		if (!validator.isMongoId(chatID)) {
			return res.status(400).json({
				success: false,
				message: "invalid chat Id",
			});
		}

		await User.updateMany(
			{ conversation: chatID },
			{ $pull: { conversation: chatID } },
			{ session }
		);

		console.log(user);
		const result = await Chat.deleteOne({ _id: chatID }).session(session);
		if (!result.acknowledged && result.deletedCount === 0) {
			return res.status(404).json({
				success: false,
				message: "no such chat exists",
			});
		}

		await session.commitTransaction();
		return res.status(200).json({
			success: true,
			message: "chat deleted successfully",
			data: result,
		});
	} catch (error) {
		await session.abortTransaction();
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	} finally {
		await session.endSession();
	}
};
