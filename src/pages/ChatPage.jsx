import React, { useState } from "react";
import ChatSidebar from "../components/Messages/ChatSidebar";
import ChatSection from "../components/Messages/ChatSection";
import useMessageStore from "../store/MessagesStore";
import { useEffect } from "react";

const ChatPage = () => {
  const {
    open_sidebar,
    set_open_sidebar,
    selected_user,
    subscribe_to_new_message_notifications,
    unsubscribe_from_new_message_notifications,
  } = useMessageStore();

  // ✅ GOOD - Run side effects in useEffect
  useEffect(() => {
    if (selected_user?._id) {
      set_open_sidebar(false);
    }
  }, [selected_user?._id, set_open_sidebar]);

  useEffect(() => {
    subscribe_to_new_message_notifications();

    return () => {
      unsubscribe_from_new_message_notifications();
    };
  }, []);

  return (
    <section className="flex h-screen bg-background overflow-x-hidden">
      <div
        className={`hidden md:flex duration-300 md:w-auto ${
          open_sidebar ? "w-full" : "w-0"
        }`}
      >
        <ChatSidebar smallScreen={false} />
      </div>
      <div
        className={`flex md:hidden duration-300 md:w-auto ${
          open_sidebar ? "w-full" : "w-0"
        }`}
      >
        <ChatSidebar smallScreen={true} />
      </div>

      {/* Main Content Area */}
      <ChatSection />
    </section>
  );
};

export default ChatPage;
