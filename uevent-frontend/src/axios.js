import axios from "axios";

export const API_URL =  `http://localhost:3001/api`

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

$api.interceptors.response.use(
    (config) => {
      return config;
    },
    async (error) => {
      const originalReq = error.config;
      if (
        error.response.status === 401 &&
        error.config &&
        !error.config._isRetry
      ) {
        originalReq._isRetry = true;
        try {
          const response = await axios.get(`${API_URL}/auth/refresh`, {
            withCredentials: true,
          });
          localStorage.setItem("token", response.data.accessToken);
          return $api.request(originalReq, { withCredentials: true });
        } catch (e) {
          console.log("Auth error");
        }
      }
      throw error;
    },
    { credentials: "include" }
  );


export default $api;