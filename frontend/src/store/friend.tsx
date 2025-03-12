import { create } from "zustand";
import api from "../services/api";
import useAuthStore from "./Auth-Store";
import { isError } from "../services/isError";

type Friend = {
	_id: string;
	fullname: string;
	isOnline?: boolean;
	avatar: string;
};
type Request = {
	_id: string;
	fullname: string;
	email: string;
	avatar: string;
	createdAt: Date;
};
type SearchQuery = { email?: string; fullname?: string } | null;
interface FriendState {
	friend: Friend | null;
	friends: Friend[];
	isLoading: boolean;
	error: string | null;
	getFriend: (x: string) => Promise<void>;
	setFriend: (x: Friend) => void;
	getFriends: () => Promise<void>;
	sendFriendRequest: (s: string) => Promise<void>;
	fetchRequests: () => Promise<Request[]>;
	acceptRequest: (id: string) => Promise<void>;
	declineRequest: (id: string) => Promise<void>;
	findUsers: (
		q: { email?: string; fullname?: string } | null
	) => Promise<Friend[]>;
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

		try {
			await api.post(
				`/friends/request/${userID}`,
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
		set({ isLoading: true, error: null });
		try {
			const { accessToken } = useAuthStore.getState();

			const response = await api.get(`/friends/requests`, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});

			const requests = response.data;
			return requests;
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
	acceptRequest: async (id: string) => {
		set({ isLoading: true, error: null });
		try {
			const { accessToken } = useAuthStore.getState();

			await api.post(
				`/friends/accept`,
				{
					friendID: id,
				},
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
	declineRequest: async (id: string) => {
		set({ isLoading: true, error: null });
		try {
			const { accessToken } = useAuthStore.getState();

			await api.post(
				`/friends/decline`,
				{
					friendID: id,
				},
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
	
	findUsers: async (query: SearchQuery) => {
		set({ isLoading: true, error: null });
		try {
			// Ensure only valid params are added
			const params = new URLSearchParams();
			if (query?.email) params.append("email", query.email);
			if (query?.fullname) params.append("fullname", query.fullname);

			const response = await api.get(`/users/all?${params.toString()}`);

			const searchResult: Friend[] = response.data.results;
			return searchResult;
		} catch (error) {
			if (isError(error)) {
				set({ error: error.message });
			} else {
				set({
					error: "An unknown error occurred",
				});
			}
			return [];
		} finally {
			set({ isLoading: false });
		}
	},
}));

export default useFriendStore;
