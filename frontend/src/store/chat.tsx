import { create } from "zustand";
import api from "../services/api";
import useAuthStore from "./Auth-Store";
import type { ChatState } from "../types/States";
import { persist } from "zustand/middleware";

const limit = 25;
const useMsgStore = create<ChatState>()(
	persist(
		(set, get) => ({
			messages: [],
			isLoading: false,
			chat: "",
			friend: null,
			page: 1,

			getMsgsOfChat: async () => {
				const { accessToken } = useAuthStore.getState();
				try {
					set({ isLoading: true });
					const response = await api.get(
						`/messages/${get().chat}?page=${
							get().page
						}&limit=${limit}`,
						{
							headers: { Authorization: `Bearer ${accessToken}` },
						}
					);

					if (response.data.success === false)
						throw new Error(response.data.message);

					const newMsgs = response.data.messages.reverse(); // To ascending
					set((state) => ({
						messages:
							state.page === 1
								? newMsgs
								: [...newMsgs, ...state.messages],
						isLoading: false,
						page: response.data.pagination.currentPage,
					}));
				} catch (error) {
					console.log(
						error instanceof Error ? error.message : "unknown error"
					);
					set({ isLoading: false, messages: [] });
				}
			},
			setChat: async (id) => {
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

					const { chatID, friend } = response.data;
					set({ chat: chatID, isLoading: false, friend });
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
						console.log(exists);
						if (!exists) {
							return { messages: [...state.messages, message] };
						}
					}
					return state; // No change if message is a duplicate or for another chat
				});
			},
			loadMoreMessages: async () => {
				const next = get().page + 1;
				set({ page: next });
				await get().getMsgsOfChat();
			},
		}),
		{
			name: "msg-storage",
			partialize: (state) => ({
				chat: state.chat,
				friend: state.friend,
			}),
			storage: {
				getItem: (name) =>
					JSON.parse(sessionStorage.getItem(name) || "null"),
				setItem: (name, value) =>
					sessionStorage.setItem(name, JSON.stringify(value)),
				removeItem: (name) => sessionStorage.removeItem(name),
			},
		}
	)
);

export default useMsgStore;
