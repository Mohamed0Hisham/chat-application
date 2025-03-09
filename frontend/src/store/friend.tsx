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
	friend: Friend | null;
	friends: Friend[];
	isLoading: boolean;
	error: string | null;
	getFriend: (x: string) => Promise<void>;
	setFriend: (x: Friend) => void;
	getFriends: () => Promise<void>;
	clearError: () => void;
}
const isError = (error: unknown): error is Error => {
	return error instanceof Error;
};

const useFriendStore = create<FriendState>((set, get) => ({
	friend: null,
	friends: [],
	isLoading: false,
	error: null,

	getFriend: async (friendID: string) => {
		set({ isLoading: true, error: null });
		try {
			const user = useAuthStore.getState().user;
			if (!user?.userID) {
				set({ error: "Not authenticated" });
				return;
			}

			const friend: Friend = await api.get(
				`/users/${user?.userID}/friends/${friendID}`
			);
			set({
				friend,
				isLoading: false,
				error: null,
			});
		} catch (error) {
			if (isError(error)) {
				set({ error: error.message, isLoading: false, friend: null });
			} else {
				set({ error: "An unknown error occurred" });
			}
		}
	},
	setFriend: (friend) => set({ friend }),
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
			if (isError(error)) {
				set({ error: error.message });
			} else {
				set({
					error: "An unknown error occurred",
					friends: [],
					isLoading: false,
				});
			}
		}
	},
	clearError: () => set({ error: null }),
}));

export default useFriendStore;
