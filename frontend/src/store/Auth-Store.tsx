import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";
import { indexedDBStorage, createJSONStorage } from "../services/IDB";
import type { AuthState } from "../types/States";

const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: undefined,
			accessToken: undefined,
			isLoading: false,
			isAuthenticated: false,
			isLoggingOut: false,
			isInitialized: false,

			register: async (fullname, email, password) => {
				set({ isLoading: true });
				try {
					const response = await api.post(`/users/register`, {
						email,
						password,
						fullname,
					});
					const { success, message } = response.data;
					if (!success) {
						throw new Error(message);
					}
					set({ isLoading: false });
				} catch (error) {
					console.error("failed to register the user:", error);
					set({ isLoading: false });
				}
			},

			login: async (email, password) => {
				try {
					set({ isLoading: true });
					const response = await api.post("/users/login", {
						email,
						password,
					});
					const { success, message, accessToken } = response.data;
					if (!success) {
						throw new Error(message);
					}
					set({
						accessToken,
						isAuthenticated: true,
					});
				} catch (error) {
					console.error(
						"login failed",
						error instanceof Error ? error.message : ""
					);
					set({
						user: undefined,
						accessToken: undefined,
						isAuthenticated: false,
					});
				} finally {
					set({ isLoading: false });
				}
			},

			checkAuth: async () => {
				set({ isLoading: true });
				const { accessToken } = get();
				if (!accessToken) {
					set({
						user: undefined,
						accessToken: undefined,
						isAuthenticated: false,
						isLoading: false,
						isInitialized: true,
					});
					return;
				}

				try {
					const response = await api.get(`/users/profile`, {
						headers: { Authorization: `Bearer ${accessToken}` },
					});
					const { success, message, user } = response.data;
					if (!success) {
						throw new Error(message);
					}
					set({
						user,
						isAuthenticated: true,
					});
				} catch (error) {
					console.error(
						"check auth failed",
						error instanceof Error ? error.message : ""
					);
					set({
						user: undefined,
						accessToken: undefined,
						isAuthenticated: false,
					});
				} finally {
					set({
						isLoading: false,
						isInitialized: true,
					});
				}
			},

			logout: async () => {
				set({ isLoggingOut: true });
				try {
					const response = await api.post(
						"/users/logout",
						undefined,
						{
							headers: {
								Authorization: `Bearer ${get().accessToken}`,
							},
						}
					);
					const { success, message } = response.data;
					if (!success) {
						throw new Error(message);
					}
				} catch (error) {
					console.error(
						"Logout failed:",
						error instanceof Error ? error.message : ""
					);
				} finally {
					set({
						user: undefined,
						accessToken: undefined,
						isAuthenticated: false,
						isLoggingOut: false,
					});
					window.location.href = "/login";
				}
			},

			refreshAccessToken: async () => {
				try {
					const response = await api.post("/auth/refresh");
					const { accessToken } = response.data;
					set({ accessToken });
				} catch (error) {
					console.error(
						"Token refresh failed:",
						error instanceof Error ? error.message : ""
					);
					get().logout();
				}
			},

			getProfile: async () => {
				set({ isLoading: true });
				try {
					const response = await api.get(`/users/profile`, {
						headers: {
							Authorization: `Bearer ${get().accessToken}`,
						},
					});
					const { success, message, user } = response.data;
					if (!success) {
						throw new Error(message);
					}
					set({ user });
				} catch (error) {
					console.error(
						"failed to fetch user profile",
						error instanceof Error ? error.message : ""
					);
				} finally {
					set({ isLoading: false });
				}
			},

			updateProfile: async (update: object) => {
				set({ isLoading: true });
				try {
					const response = await api.put(
						`/users/profile/update`,
						update,
						{
							headers: {
								Authorization: `Bearer ${get().accessToken}`,
							},
						}
					);
					const { success, message, user } = response.data;
					if (!success) {
						throw new Error(message);
					}
					set({ user });
				} catch (error) {
					const message =
						error instanceof Error
							? error.message
							: "Update failed";
					throw new Error(message);
				} finally {
					set({ isLoading: false });
				}
			},
		}),
		{
			name: "auth-storage", // Key for the storage
			storage: createJSONStorage(() => indexedDBStorage), // Wrap IndexedDB storage
			partialize: (state) => ({
				user: state.user,
				accessToken: state.accessToken,
				isAuthenticated: state.isAuthenticated,
			}),
		}
	)
);

export default useAuthStore;
