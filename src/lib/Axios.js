import axios from "axios";

export const axiosInstance = axios.create({
  // change the url for production
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "http://localhost:3000/api",
  // baseURL: "http://192.168.100.88:3000/api",
  withCredentials: true,
});
