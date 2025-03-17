export interface Person {
	_id: string;
	fullname: string;
	email: string;
	isOnline: boolean;
	avatar: string | null;
}

export interface User extends Person {
	createdAt: Date;
	friendsCount: number | null;
	groupsCount: number | null;
}

