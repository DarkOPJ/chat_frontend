import axios from "axios";

export const axiosInstance = axios.create({
  // change the url for production
  baseURL:
    import.meta.env.VITE_NODE_ENV === "development"
      ? "http://localhost:3000/api"
      : import.meta.env.VITE_API_URL,
  withCredentials: true,
});
