import React, { useState } from "react";
import ChatSidebar from "../components/Messages/ChatSidebar";
import ChatSection from "../components/Messages/ChatSection";
import useMessageStore from "../store/MessageStore";

const ChatPage = () => {
  const { chats, change_sidebar_width } = useMessageStore();
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <section className="flex h-screen bg-dark_purple overflow-x-hidden">
      <div className={`flex duration-300 md:w-auto ${openSidebar ? "w-full" : "w-0"}`}>
        <ChatSidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar}/>
      </div>

      {/* Main Content Area */}
      <ChatSection chat={chats[0]} openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
    </section>
  );
};

export default ChatPage;
