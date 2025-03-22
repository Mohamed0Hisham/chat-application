import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";
import type { AuthState } from "../types/States";

const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: undefined,
			accessToken: undefined,
			isLoading: false,
			isAuthenticated: false,
			isLoggingOut: false,
			error: null,

			setError: (message: string | null) => set({ error: message }),
			register: async (fullname, email, password) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.post(`/users/register`, {
						email,
						password,
						fullname,
					});
					const { success, message } = response.data;
					if (!success) throw new Error(message);
					set({ isLoading: false });
				} catch (error) {
					console.log(error);
					const message =
						error instanceof Error && error.name !== "AxiosError"
							? error.message
							: "failed to register the user";
					set({ isLoading: false, error: message });
				}
			},

			login: async (email, password) => {
				try {
					set({ isLoading: true, error: null });
					const response = await api.post("/users/login", {
						email,
						password,
					});

					const { success, message, accessToken, user } =
						response.data;
					if (!success) throw new Error(message);

					set({
						accessToken,
						user,
						isAuthenticated: true,
					});
				} catch (error) {
					const message =
						error instanceof Error && error.name !== "AxiosError"
							? error.message
							: "failed to login the user";
					set({
						accessToken: undefined,
						user: undefined,
						isAuthenticated: false,
						error: message,
					});
				} finally {
					set({ isLoading: false });
				}
			},
			logout: async () => {
				set({ isLoggingOut: true, error: null });
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
					if (!success) throw new Error(message);
				} catch (error) {
					const message =
						error instanceof Error && error.name !== "AxiosError"
							? error.message
							: "failed to logout";
					set({ error: message });
				} finally {
					set({
						accessToken: undefined,
						user: undefined,
						isAuthenticated: false,
						isLoggingOut: false,
					});
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
				set({ isLoading: true, error: null });
				try {
					const response = await api.get("/users/profile", {
						headers: {
							Authorization: `Bearer ${get().accessToken}`,
						},
					});
					const { success, message, user } = response.data;
					if (!success) throw new Error(message);
					set({ user });
				} catch (error) {
					const message =
						error instanceof Error && error.name !== "AxiosError"
							? error.message
							: "failed to fetch user profile";
					set({ error: message });
				} finally {
					set({ isLoading: false });
				}
			},

			updateProfile: async (update: object) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.put(
						"/users/profile/update",
						update,
						{
							headers: {
								Authorization: `Bearer ${get().accessToken}`,
							},
						}
					);
					const { success, message, user } = response.data;
					if (!success) throw new Error(message);
					set({ user });
				} catch (error) {
					const message =
						error instanceof Error && error.name !== "AxiosError"
							? error.message
							: "update failed";
					set({ error: message });
				} finally {
					set({ isLoading: false });
				}
			},
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({
				isAuthenticated: state.isAuthenticated,
				user: state.user,
				accessToken: state.accessToken,
			}),
			storage: {
				getItem: (name) =>
					JSON.parse(sessionStorage.getItem(name) || "null"),
				setItem: (name, value) =>
					sessionStorage.setItem(name, JSON.stringify(value)),
				removeItem: (name) => sessionStorage.removeItem(name),
			},
		}
	)
);

export default useAuthStore;
