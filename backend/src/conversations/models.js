import { Schema, model } from "mongoose";

const ConversationSchema = new Schema(
	{
		participants: {
			type: [Schema.Types.ObjectId],
			ref: "User",
			required: true,
		},
		messages: {
			type: [Schema.Types.ObjectId],
			ref: "Message",
			default: [],
		},
	},
	{ timestamps: true }
);
ConversationSchema.index({ participants: 1 }, { unique: true });
const Conversation = model("conversation", ConversationSchema);
export default Conversation;
