// messageService.js
import Msg from "./models.js";
import Chat from "../conversations/models.js";
import { startSession } from "mongoose";

export const saveMessage = async (chatID, senderID, content) => {
	const session = await startSession();
	try {
		session.startTransaction();

		const chat = await Chat.findById(chatID).session(session);
		if (!chat) {
			throw new Error("Chat not found");
		}

		const isParticipant = chat.participants.some((userID) =>
			userID.equals(senderID)
		);
		if (!isParticipant) {
			throw new Error("Unauthorized operation");
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
		return msg;
	} catch (error) {
		await session.abortTransaction();
		throw error;
	} finally {
		await session.endSession();
	}
};
