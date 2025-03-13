import { create } from "zustand";
import api from "../services/api";
import useAuthStore from "./Auth-Store";

type Msg = {
	_id?: string;
	content: string;
	createdAt: Date;
	senderID: string;
};
interface ChatState {
	messages: Msg[];
	isLoading: boolean;
	chat: string;
	getMsgsOfChat: (id: string) => Promise<void>;
	setChat: (id: string) => Promise<void>;
}

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

			const msgs: Msg[] = response.data.messages;
			set({ messages: msgs, isLoading: false });
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

			const { chat } = response.data;
			set({ chat, isLoading: false });
		} catch (error) {
			console.log(
				error instanceof Error ? error.message : "unknown error"
			);
			set({ isLoading: false });
		}
	},
}));

export default useMsgStore;
