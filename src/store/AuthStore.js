import { create } from "zustand";
import { axiosInstance } from "../lib/Axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { googleLogout } from "@react-oauth/google";

// Change the production url
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://telejambackend-03843.sevalla.app";

const useAuthStore = create((set, get) => ({
  socket: null,
  authenticated_user: null,
  is_authenticating: true,
  is_signing_up: false,
  is_logging_in: false,
  is_updating_profile_pic: false,
  is_updating_profile_info: false,
  is_deleting_profile_pic: false,
  profile_editted: false,
  online_users: [],

  connect_socket: () => {
    const { authenticated_user } = get();

    if (!authenticated_user || get().socket?.connected) return;

    // Initialize the socket.
    const socket = io(BASE_URL, { withCredentials: true });

    // Use the socket to connect to the base url.
    socket.connect();

    // After successful connection, set the store socket as the initialized socket
    set({ socket: socket });

    // Listen for all connected users event
    socket.on("get_all_online_users", (user_ids) => {
      set({ online_users: user_ids });
    });
  },
  disconnect_socket: () => {
    const { socket } = get();
    if (socket?.connected) socket.disconnect();
  },

  check_authentication_state: async () => {
    const { connect_socket, disconnect_socket } = get();

    set({ is_authenticating: true });
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authenticated_user: res.data });
      connect_socket();
    } catch (error) {
      disconnect_socket();
      set({ authenticated_user: null });
      console.log(error);
      // TODO remove the log
      console.log("Error while authenticating.");
    } finally {
      set({ is_authenticating: false });
    }
  },

  user_signup: async (credentials, password_data) => {
    const { connect_socket } = get();

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

      connect_socket();
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
    const { connect_socket } = get();

    set({ is_logging_in: true });
    try {
      const existing_user = {
        ...credentials,
        password: password_data.password,
      };

      const res = await axiosInstance.post("/auth/login", existing_user);

      if (res.data.success) {
        set({ authenticated_user: res.data });
        toast.success("Keep chatting with us! 😉");
      } else {
        toast.error(res.data.message || "Your request could not be processed.");
        set({ authenticated_user: null });
      }

      connect_socket();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Your request could not be processed."
      );
      set({ authenticated_user: null });
    } finally {
      set({ is_logging_in: false });
    }
  },
  user_oauth: async (code) => {
    const { connect_socket } = get();

    set({ is_logging_in: true });
    try {
      const res = await axiosInstance.post("/auth/google", { code });

      if (res.data.success) {
        set({ authenticated_user: res.data });
        toast.success("Keep chatting with us! 😉");
      } else {
        toast.error(res.data.message || "Your request could not be processed.");
        set({ authenticated_user: null });
      }

      connect_socket();
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
    const { disconnect_socket } = get();

    try {
      googleLogout();
      const res = await axiosInstance.post("/auth/logout");
      disconnect_socket();
      set({ authenticated_user: null });
      toast.success(res.data.message);
    } catch (error) {
      // TODO
      console.log("There was an error with the Logout", error);
    }
  },

  compare_update_data: (data) => {
    const { full_name, bio, username } = get().authenticated_user;

    const hasChanges =
      full_name !== data.full_name.trim() ||
      username !== data.username.trim() ||
      bio !== data.bio.trim();

    set({ profile_editted: hasChanges });
  },
  update_profile_info: async (data) => {
    set({ is_updating_profile_info: true });
    try {
      const res = await axiosInstance.put("/profile/update_profile_info", data);
      set({ authenticated_user: res.data.user });
      toast.success(res.data.message || "Profile updated successfully");
      set({ profile_editted: false });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Your profile could not be updated."
      );
    } finally {
      set({ is_updating_profile_info: false });
    }
  },

  update_profile_pic: async (data) => {
    set({ is_updating_profile_pic: true });
    try {
      const res = await axiosInstance.put("/profile/update_profile_pic", data);
      set({ authenticated_user: res.data.user });
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      set({ is_updating_profile_pic: false });
    }
  },

  delete_profile_pic: async () => {
    set({ is_deleting_profile_pic: true });
    try {
      const res = await axiosInstance.delete("/profile/delete_profile_pic");
      set({ authenticated_user: res.data.user });
      toast.success(res.data.message || "Profile picture deleted");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "There was a problem deleting your profile picture."
      );
    } finally {
      set({ is_deleting_profile_pic: false });
    }
  },
}));

export default useAuthStore;
