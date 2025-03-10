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

const useFriendStore = create<FriendState>((set) => ({
	friend: null,
	friends: [],
	isLoading: false,
	error: null,

	getFriend: async (friendID: string) => {
		set({ isLoading: true, error: null });
		try {
			const { user, token } = useAuthStore.getState();
			if (!user?._id) {
				set({ error: "Not authenticated" });
				return;
			}

			const friend: Friend = await api.get(
				`/users/${user?._id}/friends/${friendID}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
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
			const { user, token } = useAuthStore.getState();
			if (!user) {
				return;
			}
			const response = await api.get(`/users/${user._id}/friends`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const friends = response.data.data;
			set({
				friends,
				isLoading: false,
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
