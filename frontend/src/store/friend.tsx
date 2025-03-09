import { create } from "zustand";
import api from "../services/api";
import useAuthStore from "./Auth-Store";

type Friend = {
	_id: string;
	fullname: string;
	isOnline: boolean;
	avatar: string;
};
interface FriendState {
	user?: { userID: string; fullname: string };
	friend?: Friend;
	friends: Friend[];
	isLoading: boolean;
	getFriend: (x: string) => Promise<void>;
	setFriend: (x: Friend) => void;
	getFriends: () => Promise<void>;
}

const useFriendStore = create<FriendState>((set, get) => ({
	user: useAuthStore()?.user,
	friend: undefined,
	friends: [],
	isLoading: false,

	getFriend: async (friendID: string) => {
		set({ isLoading: true });
		try {
			const friend: Friend = await api.get(
				`/users/${get().user?.userID}/friends/${friendID}`
			);
			set({
				friend,
				isLoading: true,
			});
		} catch (error) {
			console.error(error);
			set({ friend: undefined, isLoading: false });
		}
	},
	setFriend: async (friend: Friend) => {
		try {
			set({ isLoading: true, friend });
		} catch (error) {
			console.error(error);
			set({ friend: undefined, isLoading: false });
		}
	},
	getFriends: async () => {
		set({ isLoading: true });
		try {
			const friends: Friend[] = await api.get(
				`/users/${get().user?.userID}/friends`
			);
			set({
				friends,
				isLoading: true,
			});
		} catch (error) {
			console.error(error);
			set({ friends: undefined, isLoading: false });
		}
	},
}));

export default useFriendStore;
