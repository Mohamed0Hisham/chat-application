import { create } from "zustand";
import api from "../services/api";
import useAuthStore from "./Auth-Store";
import { isError } from "../services/isError";

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
	sendFriendRequest: (s: string) => Promise<void>;
	fetchRequests: () => Promise<void>;
}

const useFriendStore = create<FriendState>((set) => ({
	friend: null,
	friends: [],
	isLoading: false,
	error: null,

	getFriend: async (friendID: string) => {
		set({ isLoading: true, error: null });
		try {
			const { user, accessToken } = useAuthStore.getState();
			if (!user?._id) {
				set({ error: "Not authenticated" });
				return;
			}

			const friend: Friend = await api.get(
				`/users/${user?._id}/friends/${friendID}`,
				{
					headers: { Authorization: `Bearer ${accessToken}` },
				}
			);
			set({
				friend,
				error: null,
			});
		} catch (error) {
			if (isError(error)) {
				set({ error: error.message, friend: null });
			} else {
				set({ error: "An unknown error occurred" });
			}
		} finally {
			set({ isLoading: false });
		}
	},
	setFriend: (friend) => set({ friend }),
	getFriends: async () => {
		set({ isLoading: true });
		try {
			const { user, accessToken } = useAuthStore.getState();
			if (!user) {
				return;
			}
			const response = await api.get(`/users/${user._id}/friends`, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			const friends = response.data.data;
			set({
				friends,
			});
		} catch (error) {
			if (isError(error)) {
				set({ error: error.message });
			} else {
				set({
					error: "An unknown error occurred",
					friends: [],
				});
			}
		} finally {
			set({ isLoading: false });
		}
	},
	sendFriendRequest: async (userID: string) => {
		set({ isLoading: true, error: null });
		const { accessToken } = useAuthStore.getState();
		console.log(accessToken);
		try {
			await api.post(
				`/users/friendrequest?to=${userID}`,
				{},
				{
					headers: { Authorization: `Bearer ${accessToken}` },
				}
			);
		} catch (error) {
			if (isError(error)) {
				set({ error: error.message });
			} else {
				set({
					error: "An unknown error occurred",
				});
			}
		} finally {
			set({ isLoading: false });
		}
	},
	fetchRequests: async () => {
		set({isLoading:true})
		try {
			const { user, accessToken } = useAuthStore.getState();

			const response =  await api.get(`/users/friends/requests`)
		} catch (error) {
			if (isError(error)) {
				set({ error: error.message });
			} else {
				set({
					error: "An unknown error occurred",
				});
			}
		}finally {
			set({ isLoading: false });
		}
	}
}));

export default useFriendStore;
