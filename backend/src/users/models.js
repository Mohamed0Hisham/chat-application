import { model, Schema } from "mongoose";

const userSchema = new Schema(
	{
		fullname: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minLength: 6,
		},
		friends: {
			type: [Schema.ObjectId],
			ref: User,
			default: [],
		},
		conversation: {
			type: [Schema.ObjectId],
			ref: Conversations,
			default: [],
		},
	},
	{ timestamps: true }
);
const User = model("User", userSchema);
export default User;
