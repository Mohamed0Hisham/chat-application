import { Schema, model } from "mongoose";

const conversationSchema = new Schema({}, { timestamps: true });

const Conversation = model("conversation", conversationSchema);
export default Conversation;
