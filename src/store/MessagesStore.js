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
  streaming_message: null,
  is_recording: false,
  unread_counts: {}, // { conversation_id: count }

  is_typing: {}, // { user_id: true/false }

  draft_messages: {}, // { user_id: "draft text" }
  draft_images: {}, // { user_id: "image_preview_url" }

  search_query: "",

  set_search_query: (query) => {
    set({ search_query: query });
  },

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
      set({
        all_chat_partners: res.data,
        unread_counts: res.data.reduce((acc, chat) => {
          acc[chat._id] = chat.unread_count;
          return acc;
        }, {}),
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "There was an error loading your chats."
      );
      set({ all_chat_partners: [], unread_counts: {} });
    } finally {
      set({ is_loading_chat_partners: false });
    }
  },

  get_messages_by_id: async () => {
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

  get_filtered_results: () => {
    const { current_submenu } = useApplicationStore.getState();
    const { search_query, all_chat_partners, all_contacts } = get();

    if (!search_query.trim()) {
      // Return normal lists if no search query
      return current_submenu === "All Chats" ? all_chat_partners : all_contacts;
    }

    const query = get().search_query.toLowerCase();

    if (current_submenu === "All Chats") {
      return all_chat_partners.filter((chat) =>
        chat.partner.full_name.toLowerCase().includes(query)
      );
    } else if (current_submenu === "Contacts") {
      return all_contacts.filter((contact) =>
        contact.full_name.toLowerCase().includes(query)
      );
    }

    return [];
  },

  send_message_by_id: async (data, new_convo = false) => {
    const { authenticated_user } = useAuthStore.getState();
    const { enable_sound } = useApplicationStore.getState();
    const { selected_user } = get();

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
          msg._id === optimistic_message._id ? res.data.sent_message : msg
        ),
      }));

      // Update all_chat_partners with new conversation data
      set((state) => {
        const conversation = res.data.conversation;
        const existing_chat_index = state.all_chat_partners.findIndex(
          (chat) => chat._id === conversation._id
        );

        if (existing_chat_index !== -1) {
          // Update existing chat and move to top
          const updated_chats = [...state.all_chat_partners];
          updated_chats[existing_chat_index] = {
            ...updated_chats[existing_chat_index],
            last_message: conversation.last_message,
            updated_at: conversation.updatedAt,
          };
          // Move to top
          const [updated_chat] = updated_chats.splice(existing_chat_index, 1);
          return { all_chat_partners: [updated_chat, ...updated_chats] };
        } else {
          // Add new chat at top
          return {
            all_chat_partners: [
              {
                _id: conversation._id,
                partner: selected_user,
                last_message: conversation.last_message,
                updated_at: conversation.updatedAt,
              },
              ...state.all_chat_partners,
            ],
          };
        }
      });

      // If it's a new conversation, remove from contacts and switch to All Chats
      if (new_convo) {
        set((state) => ({
          all_contacts: state.all_contacts.filter(
            (contact) => contact._id !== selected_user._id
          ),
        }));

        const { switch_submenu } = useApplicationStore.getState();
        switch_submenu("All Chats");
      }

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

  send_voice_message: async (voiceBlob) => {
    const { selected_user, clear_draft } = get();
    const { authenticated_user } = useAuthStore.getState();
    const { enable_sound } = useApplicationStore.getState();

    if (!voiceBlob) return;

    const optimistic_message = {
      _id: `temp-${Date.now()}`,
      sender_id: authenticated_user._id,
      receiver_id: selected_user._id,
      audio: URL.createObjectURL(voiceBlob), // Blob URL for playback
      audio_blob: voiceBlob,
      createdAt: new Date().toISOString(),
      is_optimistic: true,
    };

    // Add optimistic message immediately
    set((state) => ({
      all_messages_by_id: [...state.all_messages_by_id, optimistic_message],
    }));

    set({ is_sending_message: true });

    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(voiceBlob);

      reader.onload = async () => {
        const base64Audio = reader.result;

        const res = await axiosInstance.post(
          `/messages/send/${selected_user._id}`,
          { audio: base64Audio }
        );

        // Replace optimistic message
        set((state) => ({
          all_messages_by_id: state.all_messages_by_id.map((msg) =>
            msg._id === optimistic_message._id ? res.data.sent_message : msg
          ),
        }));

        if (enable_sound) {
          message_sent.currentTime = 0;
          message_sent
            .play()
            .catch((error) => toast.error("Failed to play sound."));
        }
      };

      // Clear draft
      clear_draft(selected_user._id);
    } catch (error) {
      // Remove optimistic message on error
      set((state) => ({
        all_messages_by_id: state.all_messages_by_id.filter(
          (msg) => msg._id !== optimistic_message._id
        ),
      }));

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send voice message"
      );
    } finally {
      set({ is_sending_message: false });
    }
  },

  set_is_recording: (state) => {
    set({ is_recording: state });
  },

  select_a_user: (user) => {
    set({ selected_user: user });
    if (user !== null) {
      // Find conversation
      const conversation = get().all_chat_partners.find(
        (chat) => chat.partner._id === user._id
      );

      if (conversation) {
        get().mark_conversation_as_read(conversation._id);
      }
    }
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
      const new_voice = { ...state.draft_voice_recordings };

      delete new_drafts[user_id];
      delete new_images[user_id];
      delete new_voice[user_id];

      return {
        draft_messages: new_drafts,
        draft_images: new_images,
        draft_voice_recordings: new_voice,
      };
    });
  },

  mark_conversation_as_read: async (conversation_id) => {
    try {
      await axiosInstance.post(`/messages/${conversation_id}/mark-read`);

      set((state) => ({
        unread_counts: {
          ...state.unread_counts,
          [conversation_id]: 0,
        },
      }));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  },

  set_is_typing: (user_id, typing) => {
    set((state) => ({
      is_typing: {
        ...state.is_typing,
        [user_id]: typing,
      },
    }));
  },

  // subscribe_to_messages: () => {
  //   const { selected_user } = get();
  //   const { enable_sound } = useApplicationStore.getState();

  //   if (!selected_user) return;

  //   const socket = useAuthStore.getState().socket;

  //   socket.on("sent_message", (data) => {
  //     const message_from_selected_user =
  //       data.sent_message.sender_id === selected_user._id;
  //     if (!message_from_selected_user) return;

  //     const current_messages = get().all_messages_by_id;
  //     set({ all_messages_by_id: [...current_messages, data.sent_message] });

  //     // Mark as read since chat is open
  //     const conversation = get().all_chat_partners.find(
  //       (chat) => chat.partner._id === selected_user._id
  //     );

  //     if (conversation?._id) {
  //       get().mark_conversation_as_read(conversation._id);
  //     }

  //     if (enable_sound) {
  //       message_received.currentTime = 0;
  //       message_received
  //         .play()
  //         .catch((error) => toast.error("Failed to play sound."));
  //     }
  //   });

  //   // Add this listener for read receipts
  //   socket.on("messages_marked_as_read", (data) => {
  //     set((state) => ({
  //       all_messages_by_id: state.all_messages_by_id.map((msg) =>
  //         msg.receiver_id === data.reader_id ? { ...msg, is_read: true } : msg
  //       ),
  //     }));
  //   });
  // },
  // unsubscribe_from_messages: () => {
  //   const { socket } = useAuthStore.getState();
  //   socket.off("sent_message");
  //   socket.off("messages_marked_as_read"); // Add this
  // },

  // subscribe_to_ai_streaming: () => {
  //   const socket = useAuthStore.getState().socket;
  //   if (!socket) return;

  //   socket.on("ai_message_chunk", (data) => {
  //     set({
  //       streaming_message: {
  //         _id: data.message_id,
  //         text: data.full_text,
  //         sender_id: data.sender_id,
  //         receiver_id: data.receiver_id,
  //         createdAt: new Date(),
  //         is_streaming: true,
  //       },
  //     });
  //   });

  //   socket.on("ai_message_complete", (data) => {
  //     const { final_message, conversation } = data;

  //     set((state) => {
  //       // Add final message to messages
  //       const updated_messages = [...state.all_messages_by_id, final_message];

  //       // Update conversation in chat list
  //       const conversation_index = state.all_chat_partners.findIndex(
  //         (chat) => chat._id === conversation._id
  //       );

  //       let updated_chats = [...state.all_chat_partners];
  //       if (conversation_index !== -1) {
  //         updated_chats[conversation_index] = {
  //           ...updated_chats[conversation_index],
  //           last_message: conversation.last_message,
  //           updated_at: conversation.updatedAt,
  //         };
  //         // Move to top
  //         const [updated_chat] = updated_chats.splice(conversation_index, 1);
  //         updated_chats = [updated_chat, ...updated_chats];
  //       }

  //       return {
  //         all_messages_by_id: updated_messages,
  //         all_chat_partners: updated_chats,
  //         streaming_message: null,
  //       };
  //     });
  //   });
  // },
  // unsubscribe_from_ai_streaming: () => {
  //   const socket = useAuthStore.getState().socket;
  //   if (!socket) return;

  //   socket.off("ai_message_chunk");
  //   socket.off("ai_message_complete");
  // },

  // subscribe_to_new_message_notifications: () => {
  //   const socket = useAuthStore.getState().socket;
  //   if (!socket) return;

  //   socket.on("new_message", (data) => {
  //     const { sent_message, conversation, sender } = data;
  //     const { selected_user } = get();

  //     // Update conversation list
  //     set((state) => {
  //       const conv_index = state.all_chat_partners.findIndex(
  //         (chat) => chat._id === conversation._id
  //       );

  //       let updated_chats = [...state.all_chat_partners];

  //       if (conv_index !== -1) {
  //         updated_chats[conv_index] = {
  //           ...updated_chats[conv_index],
  //           last_message: conversation.last_message,
  //           updated_at: conversation.updatedAt,
  //         };
  //         // Move to top
  //         const [chat] = updated_chats.splice(conv_index, 1);
  //         updated_chats = [chat, ...updated_chats];
  //       } else {
  //         // New conversation
  //         updated_chats = [
  //           {
  //             _id: conversation._id,
  //             partner: sender,
  //             last_message: conversation.last_message,
  //             updated_at: conversation.updatedAt,
  //           },
  //           ...updated_chats,
  //         ];
  //       }

  //       return { all_chat_partners: updated_chats };
  //     });

  //     // If chat is NOT open, show toast and increment unread
  //     if (selected_user?._id !== sent_message.sender_id) {
  //       // Show toast notification
  //       toast.info(`${sender.full_name}: ${sent_message.text || "📷 Photo"}`, {
  //         onClick: () => {
  //           // Open chat when clicked
  //           get().select_a_user(sender);
  //         },
  //       });

  //       // Update unread count
  //       set((state) => ({
  //         unread_counts: {
  //           ...state.unread_counts,
  //           [conversation._id]:
  //             (state.unread_counts[conversation._id] || 0) + 1,
  //         },
  //       }));
  //     }
  //     // Note: Message adding when chat is open is handled by subscribe_to_messages
  //   });
  // },
  // unsubscribe_from_new_message_notifications: () => {
  //   const socket = useAuthStore.getState().socket;
  //   if (!socket) return;
  //   socket.off("new_message");
  // },

  // subscribe_to_typing: () => {
  //   const socket = useAuthStore.getState().socket;
  //   if (!socket) return;

  //   socket.on("user_typing", (data) => {
  //     get().set_is_typing(data.from, data.is_typing);
  //   });
  // },
  // unsubscribe_from_typing: () => {
  //   const socket = useAuthStore.getState().socket;
  //   if (!socket) return;
  //   socket.off("user_typing");
  // },

  // Track which listeners are active

  listeners_active: {
    messages: false,
    notifications: false,
    typing: false,
    ai_streaming: false,
  },
  // UNIFIED SOCKET SETUP - Call this ONCE when component mounts
  setup_all_socket_listeners: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) {
      console.log("Socket is not connected.");
      return;
    }

    const { listeners_active } = get();

    // Messages
    if (!listeners_active.messages) {
      socket.on("sent_message", (data) => {
        const { selected_user } = get();
        const { enable_sound } = useApplicationStore.getState();

        const message_from_selected_user =
          data.sent_message.sender_id === selected_user?._id;
        if (!message_from_selected_user) return;

        set((state) => ({
          all_messages_by_id: [...state.all_messages_by_id, data.sent_message],
        }));

        const conversation = get().all_chat_partners.find(
          (chat) => chat.partner._id === selected_user._id
        );

        if (conversation?._id) {
          get().mark_conversation_as_read(conversation._id);
        }

        if (enable_sound) {
          message_received.currentTime = 0;
          message_received
            .play()
            .catch((error) => console.log("Sound play error:", error));
        }
      });

      socket.on("messages_marked_as_read", (data) => {
        set((state) => ({
          all_messages_by_id: state.all_messages_by_id.map((msg) =>
            msg.receiver_id === data.reader_id ? { ...msg, is_read: true } : msg
          ),
        }));
      });

      set((state) => ({
        listeners_active: { ...state.listeners_active, messages: true },
      }));
    }

    // Notifications
    if (!listeners_active.notifications) {
      socket.on("new_message", (data) => {
        const { sent_message, conversation, sender } = data;
        const { selected_user } = get();

        set((state) => {
          const conv_index = state.all_chat_partners.findIndex(
            (chat) => chat._id === conversation._id
          );

          let updated_chats = [...state.all_chat_partners];

          if (conv_index !== -1) {
            updated_chats[conv_index] = {
              ...updated_chats[conv_index],
              last_message: conversation.last_message,
              updated_at: conversation.updatedAt,
            };
            const [chat] = updated_chats.splice(conv_index, 1);
            updated_chats = [chat, ...updated_chats];
          } else {
            updated_chats = [
              {
                _id: conversation._id,
                partner: sender,
                last_message: conversation.last_message,
                updated_at: conversation.updatedAt,
              },
              ...updated_chats,
            ];
          }

          return { all_chat_partners: updated_chats };
        });

        if (selected_user?._id !== sent_message.sender_id) {
          toast.info(
            `${sender.full_name}: ${
              sent_message.audio
                ? "🎙️ Audio"
                : sent_message.image
                ? sent_message.text
                  ? `📷 ${sent_message.text.slice(0, 40)}...`
                  : "📷 Photo"
                : `${sent_message.text.slice(0, 40)}...`
            }`,
            {
              onClick: () => {
                get().select_a_user(sender);
              },
            }
          );

          set((state) => ({
            unread_counts: {
              ...state.unread_counts,
              [conversation._id]:
                (state.unread_counts[conversation._id] || 0) + 1,
            },
          }));
        }
      });

      set((state) => ({
        listeners_active: { ...state.listeners_active, notifications: true },
      }));
    }

    // Typing
    if (!listeners_active.typing) {
      socket.on("user_typing", (data) => {
        get().set_is_typing(data.from, data.is_typing);
      });

      set((state) => ({
        listeners_active: { ...state.listeners_active, typing: true },
      }));
    }

    // AI Streaming
    if (!listeners_active.ai_streaming) {
      socket.on("ai_message_chunk", (data) => {
        set({
          streaming_message: {
            _id: data.message_id,
            text: data.full_text,
            sender_id: data.sender_id,
            receiver_id: data.receiver_id,
            createdAt: new Date(),
            is_streaming: true,
          },
        });
      });

      socket.on("ai_message_complete", (data) => {
        const { final_message, conversation } = data;

        set((state) => {
          const updated_messages = [...state.all_messages_by_id, final_message];

          const conversation_index = state.all_chat_partners.findIndex(
            (chat) => chat._id === conversation._id
          );

          let updated_chats = [...state.all_chat_partners];
          if (conversation_index !== -1) {
            updated_chats[conversation_index] = {
              ...updated_chats[conversation_index],
              last_message: conversation.last_message,
              updated_at: conversation.updatedAt,
            };
            const [updated_chat] = updated_chats.splice(conversation_index, 1);
            updated_chats = [updated_chat, ...updated_chats];
          }

          return {
            all_messages_by_id: updated_messages,
            all_chat_partners: updated_chats,
            streaming_message: null,
          };
        });
      });

      set((state) => ({
        listeners_active: { ...state.listeners_active, ai_streaming: true },
      }));
    }
  },
  cleanup_all_socket_listeners: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.off("sent_message");
    socket.off("messages_marked_as_read");
    socket.off("new_message");
    socket.off("user_typing");
    socket.off("ai_message_chunk");
    socket.off("ai_message_complete");

    set({
      listeners_active: {
        messages: false,
        notifications: false,
        typing: false,
        ai_streaming: false,
      },
    });
  },
}));

export default useMessageStore;
