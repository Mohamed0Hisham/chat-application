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
	getMsgsOfChat: (x: string) => Promise<Msg[] | undefined>;
	setChat: (id: string) => Promise<void>;
}

const useMsgStore = create<ChatState>((set) => ({
	messages: [],
	isLoading: false,
	chat: "",

	getMsgsOfChat: async (chatID) => {
		const { token } = useAuthStore.getState();
		try {
			set({ isLoading: true });
			const msgs: Msg[] = await api.get(`/messages/${chatID}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			set({ messages: msgs, isLoading: false });
			return msgs;
		} catch (error) {
			console.log(error);
			set({ isLoading: false });
		}
	},
	setChat: async (id) => {
		const { token } = useAuthStore.getState();
		try {
			set({ isLoading: true });
			const response = await api.get(
				`/conversations/chat?friendID=${id}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			console.log(response.data);
			const { chat } = response.data;
			set({ chat, isLoading: false });
		} catch (error) {
			console.log(error);
			set({ isLoading: false });
		}
	},
}));

export default useMsgStore;
