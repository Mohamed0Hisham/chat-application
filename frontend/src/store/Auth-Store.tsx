import { create } from "zustand";
import api from "../services/api";
import useFriendStore from "./friend";

type User = {
	_id: string;
	fullname: string;
	email: string;
	avatar: string | null;
	joinDate: Date;
	friendsCount: number | null;
	groupsCount: number | null;
};

interface AuthState {
	user?: User;
	accessToken?: string;
	isLoading: boolean;
	isAuthenticated: boolean;
	isLoggingOut: boolean;
	checkAuth: () => Promise<void>;
	register: (a: string, b: string, c: string) => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	refreshAccessToken: () => Promise<void>;
	getProfile: () => Promise<void>;
	updateProfile: (update: object) => Promise<void>;
}

const clearAuthState = () => {
	localStorage.removeItem("accessToken");
	localStorage.removeItem("user");
	return {
		user: undefined,
		accessToken: undefined,
		isAuthenticated: false,
	};
};

const useAuthStore = create<AuthState>((set, get) => ({
	user: undefined,
	accessToken: undefined,
	isLoading: false,
	isAuthenticated: false,
	isLoggingOut: false,

	login: async (email, password) => {
		try {
			set({ isLoading: true });
			const response = await api.post("/users/login", {
				email,
				password,
			});
			const { accessToken } = response.data;
			localStorage.setItem("accessToken", accessToken);

			set({
				accessToken,
				isAuthenticated: true,
			});
		} catch (error) {
			console.error(
				"login failed",
				error instanceof Error ? error.message : ""
			);
			set(clearAuthState());
		} finally {
			set({ isLoading: false });
		}
	},

	getProfile: async () => {
		set({ isLoading: true });
		try {
			const response = await api.get(`/users/profile`, {
				headers: { Authorization: `Bearer ${get().accessToken}` },
			});
			const Profile: User = response.data.user;
			localStorage.setItem("user", JSON.stringify(Profile));
			console.log(Profile)
			set({ user: Profile });
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
			const response = await api.put(`/users/profile/update`, update, {
				headers: { Authorization: `Bearer ${get().accessToken}` },
			});
			const Profile: User = response.data.user;
			localStorage.setItem("user", JSON.stringify(Profile));
			set({ user: Profile });
		} catch (error) {
			console.error(
				"failed to fetch user profile",
				error instanceof Error ? error.message : ""
			);
		} finally {
			set({ isLoading: false });
		}
	},
	checkAuth: async () => {
		set({
			isLoading: true,
		});

		const token = localStorage.getItem("accessToken");
		const userString = localStorage.getItem("user");

		if (token && userString) {
			try {
				const storedUser = JSON.parse(userString);
				const response = await api.get(`/users/${storedUser._id}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				set({
					user: response.data.data,
					accessToken: token,
					isAuthenticated: true,
				});
			} catch (error) {
				console.error(
					"check auth method failed",
					error instanceof Error ? error.message : ""
				);
				set(clearAuthState());
			}
		}
		set({
			isLoading: false,
		});
	},
	register: async (fullname, email, password) => {
		set({ isLoading: true });
		try {
			await api.post(`/users/register`, {
				email,
				password,
				fullname,
			});
			set({ isLoading: false });
		} catch (error) {
			console.error("failed to register the user:", error);
			set({
				isLoading: false,
			});
		}
	},

	logout: async () => {
		set({ isLoggingOut: true });
		try {
			await api.post("/users/logout", undefined, {
				headers: { Authorization: get().accessToken },
			});
			console.error("done");
		} catch (error) {
			console.error(
				"Logout failed:",
				error instanceof Error ? error.message : ""
			);
		} finally {
			// 👇 Cancel all ongoing friend requests
			const friendStore = useFriendStore.getState();
			friendStore.abortController?.abort(); // If you track controllers

			// Clear state BEFORE redirect
			set(clearAuthState());
			useFriendStore.getState().friends = [];

			// Wait for React to finish rendering
			await new Promise((resolve) => setTimeout(resolve, 50));

			// Hard redirect
			window.location.href = "/login";
		}
	},
	refreshAccessToken: async () => {
		try {
			const response = await api.post("/auth/refresh");
			const { accessToken } = response.data;
			localStorage.setItem("accessToken", accessToken);
			set({ accessToken });
		} catch (error) {
			console.error(
				"Token refresh failed:",
				error instanceof Error ? error.message : ""
			);
			get().logout();
		}
	},
}));

export default useAuthStore;
