import { openDB, DBSchema } from "idb";

// Define the database schema
interface AuthDB extends DBSchema {
	auth: {
		key: string;
		value: unknown;
	};
}

// Initialize the IndexedDB database
const dbPromise = openDB<AuthDB>("auth-db", 1, {
	upgrade(db) {
		db.createObjectStore("auth");
	},
});

// Custom storage adapter for Zustand
export const indexedDBStorage = {
	getItem: async (name: string): Promise<string | null> => {
		const db = await dbPromise;
		const value = await db.get("auth", name);
		return value ? JSON.stringify(value) : null;
	},
	setItem: async (name: string, value: string): Promise<void> => {
		const db = await dbPromise;
		await db.put("auth", JSON.parse(value), name);
	},
	removeItem: async (name: string): Promise<void> => {
		const db = await dbPromise;
		await db.delete("auth", name);
	},
};
