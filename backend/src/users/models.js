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
			type: [Schema.Types.ObjectId],
			ref: "User",
			default: [],
		},
		conversation: {
			type: [Schema.Types.ObjectId],
			ref: "conversation",
			default: [],
		},
		isOnline: {
			type: Boolean,
			default: false,
		},
		avatar: {
			type: String,
			default: "https://randomuser.me/api/portraits/men/1.jpg",
		},
		requests: {
			type: [Schema.Types.ObjectId],
			ref: "User",
			default: [],
		},
	},
	{ timestamps: true }
);
// Compound index for text search with exclusion
userSchema.index(
	{
		fullname: "text",
		_id: 1,
	},
	{
		weights: {
			fullname: 10,
		},
		name: "user_search_index",
	}
);

// Unique email index with collation
userSchema.index(
	{ email: 1 },
	{
		unique: true,
		collation: {
			locale: "en",
			strength: 2,
		},
	}
);

const User = model("User", userSchema);
export default User;
