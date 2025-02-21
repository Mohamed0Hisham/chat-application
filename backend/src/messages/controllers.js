import Chat from "../conversations/models.js";
import Msg from "./models.js";
import validator from "validator";

export const sendMsg = async (req, res) => {
	try {
		const { chatID, senderID, content } = req.body;
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

		const chat = await Chat.findById(chatID);
		if (!chat) {
			return res.status(404).json({
				success: false,
				message: "no such chat exist",
			});
		}

		const msg = await Msg.create({
			senderID,
			receiverID: chat.participants,
			content,
		});

		chat.messages.push(msg._id);
		await chat.save();

		return res.status(201).json({
			success: true,
			message: "message sent",
			data: msg,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
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
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
export const deleteMsg = async (req, res) => {
	try {
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
