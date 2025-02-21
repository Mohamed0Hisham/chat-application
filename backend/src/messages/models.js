import { Schema, model } from "mongoose";

const msgSchema = new Schema(
	{
		senderID: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverID: {
			type: [Schema.Types.ObjectId],
			ref: "User",
			required: true,
		},
		content: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Msg = model("Message", msgSchema);
export default Msg;
