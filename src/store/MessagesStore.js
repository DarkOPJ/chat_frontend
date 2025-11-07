import { create } from "zustand";
import { axiosInstance } from "../lib/Axios";
import { toast } from "react-toastify";

const useMessageStore = create((set, get) => ({
  open_sidebar: true,
  all_contacts: [],
  is_loading_contacts: false,
  all_chat_partners: [],
  is_loading_chat_partners: false,
  all_messages_by_id: [],
  is_loading_messages: false,
  selected_user: null,

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
          "There was an error loading your contacts."
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
          "There was an error loading your contacts."
      );
      set({ all_chat_partners: [] });
    } finally {
      set({ is_loading_messages: false });
    }
  },

  select_a_user: (user) => {
    set({ selected_user: user });
  },

  set_open_sidebar: (val) => {
    set({ open_sidebar: val });
  },
}));

export default useMessageStore;
