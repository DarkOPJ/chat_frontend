import { create } from "zustand";
import { axiosInstance } from "../lib/Axios";
import { toast } from "react-toastify";
import useAuthStore from "./AuthStore";
import useApplicationStore from "./ApplicationStore";

const message_sent = new Audio("/sounds/sent-text.mp3");
const message_received = new Audio("/sounds/notification.mp3");

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

  draft_messages: {}, // { user_id: "draft text" }
  draft_images: {}, // { user_id: "image_preview_url" }

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
      const res = await axiosInstance.get(
        `/messages/${get().selected_user._id}`
      );
      set({ all_messages_by_id: res.data });
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
    const { enable_sound } = useApplicationStore.getState();
    const { selected_user } = get(); // Don't get all_messages_by_id here

    // Optimistic update
    const optimistic_message = {
      _id: `temp-${Date.now()}`,
      sender_id: authenticated_user._id,
      receiver_id: selected_user._id,
      text: data.text,
      image: data.image,
      createdAt: new Date().toISOString(),
      is_optimistic: true,
    };

    set((state) => ({
      all_messages_by_id: [...state.all_messages_by_id, optimistic_message],
    }));

    set({ is_sending_message: true });
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selected_user._id}`,
        data
      );

      // Replace the optimistic message with the real one
      set((state) => ({
        all_messages_by_id: state.all_messages_by_id.map((msg) =>
          msg._id === optimistic_message._id ? res.data : msg
        ),
      }));

      if (enable_sound) {
        message_sent.currentTime = 0;
        message_sent
          .play()
          .catch((error) => toast.error("Failed to play sound."));
      }
    } catch (error) {
      // Remove the optimistic message on error
      set((state) => ({
        all_messages_by_id: state.all_messages_by_id.filter(
          (msg) => msg._id !== optimistic_message._id
        ),
      }));

      toast.error(
        error?.response?.data?.message ||
          "There was an error sending your message."
      );
    } finally {
      set({ is_sending_message: false });
    }
  },

  subscribe_to_messages: () => {
    const { selected_user } = get();
    const { enable_sound } = useApplicationStore.getState();

    if (!selected_user) return;

    const socket = useAuthStore.getState().socket;

    socket.on("sent_message", (sent_message) => {
      const message_from_selected_user =
        sent_message.sender_id === selected_user._id;
      if (!message_from_selected_user) return;

      set((state) => {
        // Check if message already exists (by real _id, not temp id)
        const message_exists = state.all_messages_by_id.some(
          (msg) => msg._id === sent_message._id && !msg.is_optimistic
        );

        if (message_exists) return state; // Don't add duplicate

        return {
          all_messages_by_id: [...state.all_messages_by_id, sent_message],
        };
      });

      if (enable_sound) {
        message_received.currentTime = 0;
        message_received
          .play()
          .catch((error) => toast.error("Failed to play sound."));
      }
    });
  },
  unsubscribe_from_messages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("sent_message");
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

  set_draft_message: (user_id, text) => {
    set((state) => ({
      draft_messages: { ...state.draft_messages, [user_id]: text },
    }));
  },

  set_draft_image: (user_id, image) => {
    set((state) => ({
      draft_images: { ...state.draft_images, [user_id]: image },
    }));
  },

  clear_draft: (user_id) => {
    set((state) => {
      const new_drafts = { ...state.draft_messages };
      const new_images = { ...state.draft_images };
      delete new_drafts[user_id];
      delete new_images[user_id];
      return { draft_messages: new_drafts, draft_images: new_images };
    });
  },
}));

export default useMessageStore;
