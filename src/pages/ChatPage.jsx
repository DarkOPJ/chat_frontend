import React, { useState } from "react";
import ChatSidebar from "../components/Messages/ChatSidebar";
import ChatSection from "../components/Messages/ChatSection";
import useMessageStore from "../store/MessagesStore";
import { useEffect } from "react";
import useApplicationStore from "../store/ApplicationStore";

const ChatPage = () => {
  const {
    open_sidebar,
    set_open_sidebar,
    selected_user,
    // subscribe_to_new_message_notifications,
    // unsubscribe_from_new_message_notifications,
    // subscribe_to_typing,
    // unsubscribe_from_typing,
  } = useMessageStore();
  const { theme } = useApplicationStore();

  useEffect(() => {
    if (theme === "light") {
      document.body.style.backgroundColor = "#ffffff";
    } else if (theme === "dark") {
      document.body.style.backgroundColor = "#212121";
    } else if (theme === "midnight") {
      document.body.style.backgroundColor = "#160430";
    }
  }, [theme]);

  // ✅ GOOD - Run side effects in useEffect
  useEffect(() => {
    if (selected_user?._id) {
      set_open_sidebar(false);
    }
  }, [selected_user?._id, set_open_sidebar]);

  useEffect(() => {
    const { setup_all_socket_listeners, cleanup_all_socket_listeners } =
      useMessageStore.getState();

    // Setup all listeners once
    setup_all_socket_listeners();

    return () => {
      // Cleanup on unmount
      cleanup_all_socket_listeners();
    };
  }, []); // Empty dependency - runs ONCE on mount

  // useEffect(() => {
  //   subscribe_to_new_message_notifications();
  //   subscribe_to_typing();

  //   return () => {
  //     unsubscribe_from_new_message_notifications();
  //     unsubscribe_from_typing();
  //   };
  // }, []);

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
