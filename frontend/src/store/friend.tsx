import { create } from "zustand";
import api from "../services/api";

type Friend = { _id: string; fullname: string; isOnline: boolean };
interface FriendState {
	friend?: Friend;
	friends?: Friend[];
	isLoading: boolean;
	getFriend: () => Promise<void>;
	getFriends: () => Promise<void>;
}
const useFriendStore = create<FriendState>((set) => ({
	friend: undefined,
	friends: undefined,
	isLoading: false,

	getFriend: async () => {
		set({ isLoading: true });
		try {
			const friend: Friend = await api.get(
				"/users/:userID/friends/:friendID"
			);
			set({
				friend,
				isLoading: true,
			});
		} catch (error) {
			console.error(error);
			set({ friend: undefined, friends: undefined, isLoading: false });
		}
	},
	getFriends: async () => {
		set({ isLoading: true });
		try {
			const friends: Friend[] = await api.get("/users/:userID/friends");
			set({
				friends,
				isLoading: true,
			});
		} catch (error) {
			console.error(error);
			set({ friend: undefined, friends: undefined, isLoading: false });
		}
	},
}));

export default useFriendStore;
