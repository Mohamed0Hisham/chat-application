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
		const { chatID } = req.params;
		if (!validator.isMongoId(chatID)) {
			return res.status(400).json({
				success: false,
				message: "invalid chat Id",
			});
		}

		const chat = await Chat.findById(chatID).lean();
		if (!chat) {
			return res.status(404).json({
				success: false,
				message: "no such chat exist",
			});
		}

		return res.status(200).json({
			success: true,
			message: "chat fetched",
			data: chat,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
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

		const userChats = await User.findById(userID)
			.populate("conversation")
			.lean();
		if (!Array.isArray(userChats) || userChats.length < 1) {
			return res.status(204).end();
		}

		return res.status(200).json({
			success: true,
			message: "user chats fetched",
			data: userChats,
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

		const { chatID } = req.params;
		if (!validator.isMongoId(chatID)) {
			return res.status(400).json({
				success: false,
				message: "invalid chat Id",
			});
		}

		const update = await Chat.findByIdAndUpdate(
			chatID,
			{ participants },
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
export const deleteConversation = async (req, res) => {};
