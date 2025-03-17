import { create } from "zustand";
import api from "../services/api";
import useAuthStore from "./Auth-Store";
import type { ChatState } from "../types/States";

const useMsgStore = create<ChatState>((set) => ({
	messages: [],
	isLoading: false,
	chat: "",

	getMsgsOfChat: async (chatID) => {
		const { accessToken } = useAuthStore.getState();
		try {
			set({ isLoading: true });
			const response = await api.get(`/messages/chat/${chatID}`, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});

			if (response.data.success === false)
				throw new Error(response.data.message);

			const msgs = response.data.messages;
			set({ messages: msgs, isLoading: false });
		} catch (error) {
			console.log(
				error instanceof Error ? error.message : "unknown error"
			);
			set({ isLoading: false, messages: [] });
		}
	},
	setChat: async (id) => {
		// Optionally fetch messages here or rely on Chat component
		const { accessToken } = useAuthStore.getState();
		try {
			set({ isLoading: true });
			const response = await api.get(
				`/conversations/chat?friendID=${id}`,
				{
					headers: { Authorization: `Bearer ${accessToken}` },
				}
			);

			if (response.data.success === false)
				throw new Error(response.data.message);

			const { chat } = response.data;
			set({ chat, isLoading: false });
		} catch (error) {
			console.log(
				error instanceof Error ? error.message : "unknown error"
			);
			set({ isLoading: false });
		}
	},
	addMessage: (message) => {
		set((state) => {
			// Only add if the message belongs to the current chat
			if (message.chatID === state.chat) {
				// Check for duplicates by _id
				const exists = state.messages.some(
					(m) => m._id === message._id
				);
				if (!exists) {
					return { messages: [...state.messages, message] };
				}
			}
			return state; // No change if message is a duplicate or for another chat
		});
	},
}));

export default useMsgStore;
