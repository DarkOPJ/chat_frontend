import React from "react";
import ChatSidebar from "../components/Messages/ChatSidebar";
import ChatSection from "../components/Messages/ChatSection";
import useMessageStore from "../store/MessageStore";

const ChatPage = () => {
  const {chats} = useMessageStore()

  return (
    <section className="flex h-screen bg-dark_purple overflow-x-hidden">
      <ChatSidebar chats={chats} />

      {/* Main Content Area */}
      <ChatSection chat={chats[0]} />
    </section>
  );
};

export default ChatPage;
