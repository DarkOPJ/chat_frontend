import { create } from "zustand";

const useApplicationStore = create((set, get) => ({
  chats: [
    {
      id: 1,
      name: "Alice Johnson",

      lastMessage: "See you tomorrow!",
      time: "2m",
    },
    {
      id: 2,
      name: "Bob Smith",

      lastMessage: "Thanks for the help",
      time: "1h",
    },
    {
      id: 3,
      name: "Carol White",

      lastMessage: "Did you get my email?",
      time: "3h",
    },
    {
      id: 4,
      name: "David Brown",

      lastMessage: "Let's catch up soon",
      time: "1d",
    },
    {
      id: 5,
      name: "Emma Davis",

      lastMessage: "Happy birthday! 🎉",
      time: "2d",
    },
  ],
  contacts: [
    { id: 1, name: "Sophia Turner", status: "Online" },
    { id: 2, name: "Liam Carter", status: "Offline" },
    { id: 3, name: "Noah Bennett", status: "Busy" },
    { id: 4, name: "Olivia Hayes", status: "Away" },
    { id: 5, name: "Ethan Ross", status: "Online" },
    { id: 6, name: "Ava Mitchell", status: "Offline" },
    { id: 7, name: "Isabella Brooks", status: "Online" },
    { id: 8, name: "Mason Rivera", status: "Away" },
    { id: 9, name: "Lucas Reed", status: "Busy" },
    { id: "ons21", name: "Harper Gray", status: "Online" },
    { id: "31s", name: "Elijah Collins", status: "Offline" },
  ],

  current_submenu: "All Chats",
  sidebar_width: 310,
  is_compact: false,
  enable_sound: true,

  switch_submenu: (menu_selected) => {
    localStorage.setItem("current_submenu", menu_selected);
    set({ current_submenu: menu_selected });
  },

  change_sidebar_width: (new_width) => {
    localStorage.setItem("sidebar_width", new_width);
    set({ sidebar_width: new_width });
  },

  change_compact: (state) => {
    localStorage.setItem("is_compact", JSON.stringify(state));
    set({ is_compact: state });
  },

  toggle_sound: () => {
    const newValue = !get().enable_sound;
    localStorage.setItem("enable_sound", newValue);
    set({ enable_sound: newValue });
  },

  hydrate: () => {
    const savedMenu = localStorage.getItem("current_submenu");
    const savedWidth = localStorage.getItem("sidebar_width");
    const savedCompact = localStorage.getItem("is_compact");
    const savedSound = localStorage.getItem("enable_sound");

    set({
      current_submenu: savedMenu || "All Chats",
      sidebar_width: savedWidth ? Number(savedWidth) : 310,
      is_compact: savedCompact ? JSON.parse(savedCompact) : false,
      enable_sound: savedSound ? JSON.parse(savedSound) : true, // ← Fixed this line
    });
  },
}));

export default useApplicationStore;
