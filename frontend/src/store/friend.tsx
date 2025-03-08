import { create } from "zustand";
import api from "../services/api";

interface FriendState {
	fullname?: string;
	isOnline: boolean;
	isLoading: boolean;

    getFriend: ()=>Promise<void>
}
const useFriendStore = create<FriendState>((set) => ({
	fullname: undefined,
	isOnline: false,
	isLoading: false,

    getFriend: async () => {
        set({isLoading:true})
        await api.get("/friend")
    }
}));


export default useFriendStore;