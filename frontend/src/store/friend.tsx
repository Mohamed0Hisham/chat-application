import { create } from "zustand";
import { persist } from "zustand/middleware";

import api from "../services/api";
import useAuthStore from "./auth";
import { isError } from "../services/isError";

import type { Person as Friend } from "../types/User";
import { FriendState } from "../types/States";

type SearchQuery = Partial<Pick<Friend, "email" | "fullname">> | null;

const useFriendStore = create<FriendState>()(
	persist(
		(set, get) => ({
			friends: [],
			isLoading: false,
			error: null,
			searchHistory: [],
			requests: [],

			getFriends: async () => {
				set({ isLoading: true });

				try {
					const { accessToken } = useAuthStore.getState();
					if (!accessToken) {
						console.log("No user or token available");
						return;
					}

					const response = await api.get(`/friends/all`, {
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
					const response = await api.post(
						`/friends/request/${userID}`,
						{},
						{
							headers: { Authorization: `Bearer ${accessToken}` },
						}
					);
					const { success, message } = response.data;

					if (!success) throw new Error(message);
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
						{ friendID: id },
						{
							headers: { Authorization: `Bearer ${accessToken}` },
						}
					);
					set((state) => ({
						requests: state.requests.filter(
							(req) => req._id !== id
						),
					}));
				} catch (error) {
					if (isError(error)) {
						set({ error: error.message });
					} else {
						set({ error: "An unknown error occurred" });
					}
					get().fetchRequests();
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
				const MAX_SEARCHES = 5;
				const now = Date.now();
				const { searchHistory } = get();

				const recentSearches = searchHistory.filter(
					(t) => now - t < 60000
				);
				if (recentSearches.length >= MAX_SEARCHES) {
					set({
						error: "Too many search attempts. Please wait 1 minute.",
					});
					return [];
				}

				set({ isLoading: true, error: null });
				try {
					const { accessToken } = useAuthStore.getState();
					set({ searchHistory: [...searchHistory, now] });

					const params = new URLSearchParams();
					if (query?.email) params.append("email", query.email);
					if (query?.fullname)
						params.append("fullname", query.fullname);

					const response = await api.get(
						`/users/all?${params.toString()}`,
						{
							headers: { Authorization: `Bearer ${accessToken}` },
						}
					);

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

					// Cleanup old search history entries
					set((state) => ({
						searchHistory: state.searchHistory.filter(
							(t) => now - t < 60000
						),
					}));
				}
			},
		}),
		{
			name: "friend-storage",
			partialize: (state) => ({
				friends: state.friends,
				requests: state.requests,
			}),
		}
	)
);

export default useFriendStore;
