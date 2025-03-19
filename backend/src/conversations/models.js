import { Schema, model } from "mongoose";

const ConversationSchema = new Schema(
	{
		name: {
			type: String,
			default: "",
		},
		avatar: {
			type: String,
			avatar: "",
		},
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
const Conversation = model("conversation", ConversationSchema);
export default Conversation;
