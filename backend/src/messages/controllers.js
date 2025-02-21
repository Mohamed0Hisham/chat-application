import Chat from "../conversations/models.js";
import Msg from "./models.js";
import validator from "validator";
import { startSession } from "mongoose";

export const sendMsg = async (req, res) => {
	const session = await startSession();
	try {
		session.startTransaction();

		const { chatID } = req.params;
		const { senderID, content } = req.body;
		if (!validator.isMongoId(chatID) || !validator.isMongoId(senderID)) {
			return res.status(400).json({
				success: false,
				message: "invalid ID sent",
			});
		}

		if (!content) {
			return res.status(400).json({
				success: false,
				message: "can't send empty message",
			});
		}

		const chat = await Chat.findById(chatID).session(session);
		if (!chat) {
			return res.status(404).json({
				success: false,
				message: "no such chat exist",
			});
		}

		const isParticipant = chat.participants.some((userID) =>
			userID.equals(senderID)
		);
		if (!isParticipant) {
			return res.status(403).json({
				success: false,
				message: "unauthorized operation",
			});
		}

		const msg = new Msg({
			chatID,
			senderID,
			receiverID: chat.participants.filter((id) => !id.equals(senderID)),
			content,
		});
		await msg.save({ session });

		chat.messages.push(msg._id);
		await chat.save({ session });

		await session.commitTransaction();
		return res.status(201).json({
			success: true,
			message: "message sent",
			data: msg,
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
export const fetchMsgs = async (req, res) => {
	try {
		const { chatID } = req.params;

		const limit = parseInt(req.query.limit) || 12;
		const page = parseInt(req.query.page) || 1;
		if (limit < 1) limit = 12;
		if (page < 1) page = 1;
		const skip = (page - 1) * limit;

		if (!validator.isMongoId(chatID)) {
			return res.status(400).json({
				success: false,
				message: "invalid ID sent",
			});
		}

		const chatExists = await Chat.exists({ _id: chatID });
		if (!chatExists) {
			return res.status(404).json({
				success: false,
				message: "Chat not found",
			});
		}

		const messages = await Msg.find({ chat: chatID })
			.select("content createdAt senderID")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean();
		const totalMessages = await Msg.countDocuments({ chat: chatID });

		return res.status(200).json({
			success: true,
			message: "Messages fetched",
			data: messages,
			pagination: {
				currentPage: page,
				totalPages: Math.ceil(totalMessages / limit),
				totalMessages,
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const editMsg = async (req, res) => {
	try {
		const { content } = req.body;
		if (!content) {
			return res.status(400).json({
				success: false,
				message: "can't send empty message",
			});
		}

		const { msgID } = req.params;
		if (!validator.isMongoId(msgID)) {
			return res.status(400).json({
				success: false,
				message: "invalid ID sent",
			});
		}

		const result = await Msg.findByIdAndUpdate(msgID, { content }).lean();
		if (!result) {
			return res.status(404).json({
				success: false,
				message: "no such message exist",
			});
		}

		return res.status(200).json({
			success: true,
			message: "message modified",
			data: result,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
export const deleteMsg = async (req, res) => {
	const session = await startSession();
	try {
		session.startTransaction();

		const { msgID } = req.params;
		if (!validator.isMongoId(msgID)) {
			return res.status(400).json({
				success: false,
				message: "invalid ID sent",
			});
		}

		const result = await Msg.deleteOne({ _id: msgID }, { session });
		if (!result.acknowledged || result.deletedCount !== 1) {
			return res.status(404).json({
				success: false,
				message: "no such message exist",
			});
		}

		await Chat.updateOne(
			{ messages: msgID },
			{ $pull: { messages: msgID } },
			{ session }
		);

		await session.commitTransaction();
		return res.status(200).json({
			success: true,
			message: "message deleted",
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
