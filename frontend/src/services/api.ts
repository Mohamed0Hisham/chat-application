import axios from "axios";
import useAuthStore from "../store/Auth-Store";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			const authStore = useAuthStore.getState();
			try {
				await authStore.refreshAccessToken();
				error.config.headers[
					"Authorization"
				] = `Bearer ${authStore.accessToken}`;
				return api(error.config); // Retry original request
			} catch (refreshError) {
				authStore.logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);
export default api;
