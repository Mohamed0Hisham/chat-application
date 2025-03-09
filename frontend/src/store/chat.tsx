import { create } from "zustand";
import api from "../services/api";

type Msg = {
	content: string;
	createdAt: Date;
	senderID: string;
	receiverID: string;
};
interface ChatState {
	messages?: Msg[];
	isLoading: boolean;
	chat: string;
	getMsgsOfChat: (x: string) => Promise<Msg[] | undefined>;
	setChat: () => Promise<void>;
}

const useMsgStore = create<ChatState>((set) => ({
	messages: undefined,
	isLoading: false,
	chat: "",

	getMsgsOfChat: async (chatID) => {
		try {
			set({ isLoading: true });
			const msgs: Msg[] = await api.get(`/messages/${chatID}`);
			set({ messages: msgs, isLoading: false });
			return msgs;
		} catch (error) {
			console.log(error);
			set({ isLoading: false });
		}
	},
	setChat: async () => {
		try {
			set({ isLoading: true });
			const chat: string = await api.get(`/conversations/`);
			set({ chat, isLoading: false });
		} catch (error) {
			console.log(error);
			set({ isLoading: false });
		}
	},
}));

export default useMsgStore;
