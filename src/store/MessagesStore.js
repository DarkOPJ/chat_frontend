import { create } from "zustand";
import { axiosInstance } from "../lib/Axios";
import { toast } from "react-toastify";
import useAuthStore from "./AuthStore";

const useMessageStore = create((set, get) => ({
  open_sidebar: true,
  all_contacts: [],
  is_loading_contacts: false,
  all_chat_partners: [],
  is_loading_chat_partners: false,
  all_messages_by_id: [],
  is_loading_messages: false,
  selected_user: null,
  is_sending_message: false,

  get_all_contacts: async () => {
    set({ is_loading_contacts: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ all_contacts: res.data });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "There was an error loading your contacts."
      );
      set({ all_contacts: [] });
    } finally {
      set({ is_loading_contacts: false });
    }
  },

  get_all_chat_partners: async () => {
    set({ is_loading_chat_partners: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ all_chat_partners: res.data });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "There was an error loading your chats."
      );
      set({ all_chat_partners: [] });
    } finally {
      set({ is_loading_chat_partners: false });
    }
  },

  get_messages_by_id: async (id) => {
    set({ is_loading_messages: true });
    try {
      const res = await axiosInstance.get(`/messages/${id}`);
      set({ all_messages_by_id: res.data });
      // console.log(res.data)
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "There was an error loading your messages."
      );
      set({ all_messages_by_id: [] });
    } finally {
      set({ is_loading_messages: false });
    }
  },

  send_message_by_id: async (data) => {
    const { authenticated_user } = useAuthStore.getState();
    const { selected_user, all_messages_by_id } = get();

    // This is an optimistic update... to add the message to your chat before its sent
    const optimistic_message = {
      _id: `temp-${Date.now()}`,
      sender_id: authenticated_user._id,
      receiver_id: selected_user._id,
      text: data.text,
      image: data.image,
      createdAt: new Date().toISOString(),
      is_optimistic: true,
    };
    set({ all_messages_by_id: all_messages_by_id.concat(optimistic_message) });

    set({ is_sending_message: true });
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selected_user._id}`,
        data
      );
      set({ all_messages_by_id: [...all_messages_by_id, res.data] });
    } catch (error) {
      set({ all_messages_by_id: all_messages_by_id });

      toast.error(
        error?.response?.data?.message ||
          "There was an error sending your message."
      );
    } finally {
      set({ is_sending_message: false });
    }
  },

  select_a_user: (user) => {
    set({ selected_user: user });
  },

  set_open_sidebar: (val) => {
    set({ open_sidebar: val });
  },

  handleDownloadImage: async (imageUrl, customFilename = null) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Auto-detect extension from URL or blob type
      let filename = customFilename;
      if (!filename) {
        const extension = imageUrl.split(".").pop().split("?")[0]; // Get extension from URL
        filename = `image.${extension}`;
      }

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("There was an error downloading this image.");
    }
  },
}));

export default useMessageStore;
