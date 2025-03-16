import { create } from "zustand";
import api from "../services/api";

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
	isInitialized: boolean;
	checkAuth: () => Promise<void>;
	register: (a: string, b: string, c: string) => Promise<void>;
	login: (email: string, password: string) => Promise<boolean>;
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
			console.error(error);
			set({
				isLoading: false,
			});
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
				set(clearAuthState());
				throw new Error(message);
			}
			localStorage.setItem("accessToken", accessToken);

			set({
				accessToken,
				isAuthenticated: true,
			});
			return true;
		} catch (error) {
			console.error(
				"login failed",
				error instanceof Error ? error.message : ""
			);
			set(clearAuthState());
			return false;
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

		if (!token || !userString) {
			set(clearAuthState());
			set({
				isLoading: false,
				isInitialized: true,
			});
			return;
		}

		try {
			const response = await api.get(`/users/profile`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			const { success, message, user } = response.data;
			if (!success) {
				set(clearAuthState());
				throw new Error(message);
			}

			set({
				user,
				accessToken: token,
				isAuthenticated: true,
			});
		} catch (error) {
			console.error(
				"check auth method failed",
				error instanceof Error ? error.message : ""
			);
			set(clearAuthState());
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
			const response = await api.post("/users/logout", undefined, {
				headers: { Authorization: `Bearer ${get().accessToken}` },
			});

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
			set(clearAuthState());
			set({ isLoggingOut: false });
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
	getProfile: async () => {
		set({ isLoading: true });
		try {
			const response = await api.get(`/users/profile`, {
				headers: { Authorization: `Bearer ${get().accessToken}` },
			});

			const { success, message, user } = response.data;
			if (!success) {
				set(clearAuthState());
				throw new Error(message);
			}

			localStorage.setItem("user", JSON.stringify(user));
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
			const response = await api.put(`/users/profile/update`, update, {
				headers: { Authorization: `Bearer ${get().accessToken}` },
			});

			const { success, message, user } = response.data;
			if (!success) {
				set(clearAuthState());
				throw new Error(message);
			}

			localStorage.setItem("user", JSON.stringify(user));
			set({ user });
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Update failed";
			throw new Error(message);
		} finally {
			set({ isLoading: false });
		}
	},
}));

export default useAuthStore;
