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

			register: async (fullname, email, password) => {
				set({ isLoading: true });
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
					console.error("failed to register the user:", error);
					set({ isLoading: false });
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
					console.error("login failed");
					set({
						accessToken: undefined,
						user: undefined,
						isAuthenticated: false,
						error: error instanceof Error ? error.message : "",
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
						isAuthenticated: false,
						isLoading: false,
					});
					return;
				}

				try {
					const response = await api.get("/users/profile", {
						headers: { Authorization: `Bearer ${accessToken}` },
					});
					const { success, message, user } = response.data;
					if (!success) throw new Error(message);

					set({ user, isAuthenticated: true });
				} catch (error) {
					console.error(
						"check auth method failed",
						error instanceof Error ? error.message : ""
					);
					set({
						accessToken: undefined,
						user: undefined,
						isAuthenticated: false,
					});
				} finally {
					set({ isLoading: false });
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
					if (!success) throw new Error(message);
				} catch (error) {
					console.error(
						"Logout failed:",
						error instanceof Error ? error.message : ""
					);
				} finally {
					set({
						accessToken: undefined,
						user: undefined,
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
					const response = await api.get("/users/profile", {
						headers: {
							Authorization: `Bearer ${get().accessToken}`,
						},
					});
					const { success, message, user } = response.data;
					if (!success) throw new Error(message);
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
					console.error(
						"update failed",
						error instanceof Error ? error.message : ""
					);
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
