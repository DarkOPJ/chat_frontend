import { create } from "zustand";

const useApplicationStore = create((set, get) => ({
  current_submenu: "All Chats",
  sidebar_width: 310,
  is_compact: false,
  enable_sound: true,
  theme: "light",

  switch_theme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme: theme });
  },

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
    const savedTheme = localStorage.getItem("theme");

    set({
      theme: savedTheme || "light",
      current_submenu: savedMenu || "All Chats",
      sidebar_width: savedWidth ? Number(savedWidth) : 310,
      is_compact: savedCompact ? JSON.parse(savedCompact) : false,
      enable_sound: savedSound ? JSON.parse(savedSound) : true,
    });
  },
}));

export default useApplicationStore;
