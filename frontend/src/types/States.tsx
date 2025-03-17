import type { Person as Friend } from "./User";
import type { User } from "./User";

export type Request = {
	_id: string;
	fullname: string;
	email: string;
	avatar: string;
	createdAt: Date;
};
export type Msg = {
	_id?: string;
	content: string;
	createdAt: Date;
	senderID: string;
};
export interface ChatState {
	messages: Msg[];
	isLoading: boolean;
	chat: string;
	getMsgsOfChat: (id: string) => Promise<void>;
	setChat: (id: string) => Promise<void>;
}

export interface AuthState {
	user?: User;
	accessToken?: string;
	isLoading: boolean;
	isAuthenticated: boolean;
	isLoggingOut: boolean;
	error: string | null;
	register: (a: string, b: string, c: string) => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	refreshAccessToken: () => Promise<void>;
	getProfile: () => Promise<void>;
	updateProfile: (update: object) => Promise<void>;
}

export interface FriendState {
	friend: Friend | null;
	friends: Friend[];
	isLoading: boolean;
	error: string | null;
	searchHistory: number[];
	requests: Request[];

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
