import { create } from "zustand";
import api from "../services/api";
import useAuthStore from "./Auth-Store";
import { isError } from "../services/isError";
import axios from "axios";

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
	searchHistory: number[];
	requests: Request[];
	abortController?: AbortController;

	getFriend: (x: string) => Promise<void>;
	setFriend: (x: Friend | null) => void;

	getFriends: () => Promise<void>;
	sendFriendRequest: (s: string) => Promise<void>;
	fetchRequests: () => Promise<void>;
	acceptRequest: (id: string) => Promise<void>;
	declineRequest: (id: string) => Promise<void>;
	findUsers: (
		q: { email?: string; fullname?: string } | null,
		signal?: AbortSignal
	) => Promise<Friend[]>;
}

const useFriendStore = create<FriendState>((set, get) => ({
	friend: null,
	friends: [],
	isLoading: false,
	error: null,
	searchHistory: [],
	requests: [],

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
		// Create new AbortController for this request
		const controller = new AbortController();
		set({ abortController: controller });

		try {
			const { accessToken, isInitialized } = useAuthStore.getState();
			if (!isInitialized) {
				console.log("Auth not initialized yet, waiting...");
				return;
			}

			if (!accessToken) {
				console.log("No user or token available");
				return;
			}

			const response = await api.get(`/friends/all`, {
				headers: { Authorization: `Bearer ${accessToken}` },
				signal: controller.signal,
			});
			const friends = response.data.data;
			set({
				friends,
			});
		} catch (error) {
			if (axios.isCancel(error)) {
				console.log("Request canceled");
				return;
			}

			if (isError(error)) {
				set({ error: error.message });
			} else {
				set({
					error: "An unknown error occurred",
					friends: [],
				});
			}
		} finally {
			set({ isLoading: false, abortController: undefined });
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

			const { requests } = response.data;
			set({ requests });
		} catch (error) {
			console.error(error);
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

	findUsers: async (query: SearchQuery, signal?: AbortSignal) => {
		const MAX_SEARCHES = 5;
		const now = Date.now();
		const { searchHistory } = get();

		// Rate limiting check
		const recentSearches = searchHistory.filter((t) => now - t < 60000);
		if (recentSearches.length >= MAX_SEARCHES) {
			set({ error: "Too many search attempts. Please wait 1 minute." });
			return [];
		}

		set({ isLoading: true, error: null });
		try {
			const { accessToken } = useAuthStore.getState();
			// Update search history
			set({ searchHistory: [...searchHistory, now] });
			// Ensure only valid params are added
			const params = new URLSearchParams();
			if (query?.email) params.append("email", query.email);
			if (query?.fullname) params.append("fullname", query.fullname);

			const response = await api.get(`/users/all?${params.toString()}`, {
				signal,
				headers: { Authorization: `Bearer ${accessToken}` },
			});

			const searchResult: Friend[] = response.data.results;
			return searchResult;
		} catch (error) {
			if (axios.isCancel(error)) {
				return []; // Expected cancellation
			}
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
			// Cleanup old search history entries
			set((state) => ({
				searchHistory: state.searchHistory.filter(
					(t) => now - t < 60000
				),
			}));
		}
	},
}));

export default useFriendStore;
