import { create } from "zustand";
import { axiosInstance } from "../lib/Axios";
import { toast } from "react-toastify";

const useAuthStore = create((set, get) => ({
  authenticated_user: null,
  is_authenticating: true,
  is_signing_up: false,
  is_logging_in: false,

  check_authentication_state: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authenticated_user: res.data });
    } catch (error) {
      console.log(error);
      // TODO remove the log
      console.log("Error while authenticating.");
      set({ authenticated_user: null });
    } finally {
      set({ is_authenticating: false });
    }
  },

  user_signup: async (credentials, password_data) => {
    set({ is_signing_up: true });
    try {
      const new_user = {
        ...credentials,
        password: password_data.password,
      };
      const res = await axiosInstance.post("/auth/signup", new_user);
      // Check if the response was successful (2xx)
      if (res.status >= 200 && res.status < 300) {
        toast.success("Welcome to Telejam! 😁");
        set({ authenticated_user: res.data });
      } else {
        toast.error(res.data.message || "Your request could not be processed.");
        set({ authenticated_user: null });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Your request could not be processed."
      );
      set({ authenticated_user: null });
    } finally {
      set({ is_signing_up: false });
    }
  },

  user_login: async (credentials, password_data) => {
    set({ is_logging_in: true });
    try {
      const existing_user = {
        ...credentials,
        password: password_data.password,
      };

      const res = await axiosInstance.post("/auth/login", existing_user);
      console.log(res.data);

      if (res.data.success) {
        set({ authenticated_user: res.data });
        toast.success("Keep chatting with us! 😉");
      } else {
        toast.error(res.data.message || "Your request could not be processed.");
        set({ authenticated_user: null });
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Your request could not be processed."
      );
      set({ authenticated_user: null });
    } finally {
      set({ is_logging_in: false });
    }
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      set({ authenticated_user: null });
      toast.success(res.data.message);
    } catch (error) {
      // TODO
      console.log("There was an error with the Logout", error);
    }
  },
}));

export default useAuthStore;
