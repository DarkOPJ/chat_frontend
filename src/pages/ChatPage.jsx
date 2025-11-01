import React, { useState, useRef, useEffect } from "react";
import ChatSidebar from "../components/Messages/ChatSidebar";
import ChatSection from "../components/Messages/ChatSection";

const ChatPage = () => {
  const chats = [
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
  ];

  return (
    <section className="flex h-screen bg-gray-100 overflow-x-hidden">
      <ChatSidebar chats={chats} />

      {/* Main Content Area */}
      <ChatSection chat={chats[0]} />
    </section>
  );
};

export default ChatPage;
