import { create } from "zustand";

const useMessageStore = create((set, get) => ({
  chats: [
    {
      id: 1,
      name: "Alice Johnson",
      avatar: "AJ",
      lastMessage: "See you tomorrow!",
      time: "2m",
    },
    {
      id: 2,
      name: "Bob Smith",
      avatar: "BS",
      lastMessage: "Thanks for the help",
      time: "1h",
    },
    {
      id: 3,
      name: "Carol White",
      avatar: "CW",
      lastMessage: "Did you get my email?",
      time: "3h",
    },
    {
      id: 4,
      name: "David Brown",
      avatar: "DB",
      lastMessage: "Let's catch up soon",
      time: "1d",
    },
    {
      id: 5,
      name: "Emma Davis",
      avatar: "ED",
      lastMessage: "Happy birthday! 🎉",
      time: "2d",
    },
  ],
  contacts: [
  { id: 1, name: "Sophia Turner", avatar: "ST", status: "Online" },
  { id: 2, name: "Liam Carter", avatar: "LC", status: "Offline" },
  { id: 3, name: "Noah Bennett", avatar: "NB", status: "Busy" },
  { id: 4, name: "Olivia Hayes", avatar: "OH", status: "Away" },
  { id: 5, name: "Ethan Ross", avatar: "ER", status: "Online" },
  { id: 6, name: "Ava Mitchell", avatar: "AM", status: "Offline" },
  { id: 7, name: "Isabella Brooks", avatar: "IB", status: "Online" },
  { id: 8, name: "Mason Rivera", avatar: "MR", status: "Away" },
  { id: 9, name: "Lucas Reed", avatar: "LR", status: "Busy" },
  { id: 10, name: "Harper Gray", avatar: "HG", status: "Online" },
  { id: 11, name: "Elijah Collins", avatar: "EC", status: "Offline" },
  { id: 12, name: "Amelia Ward", avatar: "AW", status: "Online" },
  { id: 13, name: "James Perry", avatar: "JP", status: "Busy" },
  { id: 14, name: "Charlotte Evans", avatar: "CE", status: "Away" },
  { id: 15, name: "Henry Foster", avatar: "HF", status: "Online" },
],

  current_submenu: localStorage.getItem("current_submenu") || "All Chats",

  switch_submenu: (menu_selected) => {
    localStorage.setItem("current_submenu", menu_selected);
    set({ current_submenu: menu_selected });
  },
}));

export default useMessageStore;
