import validator from "validator";
import { startSession } from "mongoose";
import User from "../users/models.js";
import Chat from "./models.js";

export const createConversation = async (req, res) => {
	const session = await startSession();
	session.startTransaction();
	try {
		const { participants } = req.body;

		if (!Array.isArray(participants) || participants.length < 1) {
			return res.status(400).json({
				success: false,
				message: "Participants must be a non-empty array.",
			});
		}

		if (participants.length > 100) {
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
		const newChat = await Chat.insertOne({ participants }, { session });

		const updateOperations = participants.map((userID) => ({
			updateOne: {
				filter: { _id: userID },
				update: { $push: { conversation: newChat._id } },
			},
		}));
		await User.bulkWrite(updateOperations, { session });

		// Commit the transaction
		await session.commitTransaction();

		return res.status(201).json({
			success: true,
			message: "New chat created between users",
			data: {
				chatID: newChat._id,
				participants: newChat.participants,
			},
		});
	} catch (error) {
		await session.abortTransaction();
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	} finally {
		if (session) session.endSession();
	}
};
export const fetchConversation = async (req, res) => {};
export const fetchUserConversations = async (req, res) => {};
export const updateConversationSetting = async (req, res) => {};
export const deleteConversation = async (req, res) => {};
