import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create an axios instance with baseURL and credentials enabled so refresh cookie is sent
const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Attach access token from localStorage on each request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: if 401, try to refresh token once and retry original request
instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response && error.response.status === 401 && !original._retry) {
      original._retry = true;
      try {
        // Debug: log current cookies so we can tell if refresh cookie exists
        try {
          // browser environment only
          // eslint-disable-next-line no-undef
          console.debug("axiosInstance: document.cookie=", document.cookie);
        } catch (ignore) {}

        // Attempt to read a stored refresh token (dev flow) and also send credentials
        const storedRefresh = localStorage.getItem("refreshToken");
        const body = storedRefresh ? { refreshToken: storedRefresh } : {};

        // Call refresh endpoint using a raw axios call to avoid loops. Send both cookie and body.
        const refreshRes = await axios.post(
          `${API_URL}/auth/refresh-token`,
          body,
          { withCredentials: true }
        );
        const newAccess = refreshRes.data?.accessToken;
        if (newAccess) {
          // store and update headers
          localStorage.setItem("token", newAccess);
          instance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccess}`;
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${newAccess}`;
          return instance(original);
        }
      } catch (e) {
        // refresh failed: clear stored auth
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
