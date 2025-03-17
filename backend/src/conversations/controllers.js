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

const sortParticipantIDs = (ids) => [...ids].sort((a, b) => a.localeCompare(b));

export const fetchConversation = async (req, res) => {
	const session = await startSession();
	let transactionStarted = false;

	try {
		const userID = req.user._id.toString();
		const { friendID } = req.query;

		if (!validator.isMongoId(userID) || !validator.isMongoId(friendID)) {
			return res.status(400).json({
				success: false,
				message: "Invalid user IDs",
			});
		}

		const friend = await User.findById(friendID, {
			fullname: 1,
			email: 1,
			isOnline: 1,
			avatar: 1,
		}).lean();

		// Consistent participant handling
		const sortedIDs = sortParticipantIDs([userID, friendID]);

		// Existing chat check
		const existingChat = await Chat.findOne({
			participants: { $all: sortedIDs, $size: 2 },
		});

		if (existingChat) {
			return res.status(200).json({
				success: true,
				message: "Chat fetched",
				chatID: existingChat._id,
				friend
			});
		}

		session.startTransaction();
		transactionStarted = true;

		// Re-check within transaction
		const existingInTransaction = await Chat.findOne({
			participants: { $all: sortedIDs, $size: 2 },
		}).session(session);

		if (existingInTransaction) {
			await session.commitTransaction();
			return res.status(200).json({
				success: true,
				message: "Chat fetched",
				chatID: existingInTransaction._id,
				friend
			});
		}

		// ELSE => Chat creation
		const newChat = await Chat.create([{ participants: sortedIDs }], {
			session,
		});

		// User updates
		const updateOps = sortedIDs.map((id) => ({
			updateOne: {
				filter: { _id: id },
				update: { $push: { conversation: newChat[0]._id } },
			},
		}));
		await User.bulkWrite(updateOps, { session });

		await session.commitTransaction();
		return res.status(200).json({
			success: true,
			message: "Chat created and fetched",
			chatID: newChat[0]._id,
			friend
		});
	} catch (error) {
		if (transactionStarted) {
			await session.abortTransaction();
		}
		return res.status(500).json({
			success: false,
			message:
				process.env.NODE_ENV === "production"
					? "Chat operation failed"
					: error.message,
		});
	} finally {
		if (session) {
			await session.endSession();
		}
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
