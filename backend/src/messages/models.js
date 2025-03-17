import { Schema, model } from "mongoose";

const msgSchema = new Schema(
	{
		chatID: {
			type: Schema.Types.ObjectId,
			ref: "Conversation",
		},
		senderID: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		receiverID: {
			type: [Schema.Types.ObjectId],
			ref: "User",
		},
		content: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Msg = model("Message", msgSchema);
export default Msg;
