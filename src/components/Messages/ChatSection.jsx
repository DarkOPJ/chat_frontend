import React, { useEffect } from "react";
import background1 from "../../assets/images/chatbg1.png";
import StartChattingPopup from "./StartChattingPopup";

import useMessageStore from "../../store/MessagesStore";
import SelectedUserBanner from "./SelectedUserBanner";
import ChatInput from "./ChatInput";
import MessagesWrapper from "./MessagesWrapper";

const ChatSection = () => {
  const {
    open_sidebar,
    selected_user,
    select_a_user,
  } = useMessageStore();

  // Escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") select_a_user(null);
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, []);



  return (
    <div
      className={`flex bg-contain relative ${
        open_sidebar ? "w-0 md:w-full" : "w-full"
      } duration-300`}
      style={{
        backgroundImage: `url(${background1})`,
      }}
    >
      {selected_user ? (
        <div className="w-full h-screen bg-[linear-gradient(135deg,rgba(99,102,241,0.1),rgba(10,10,10,0.2),rgba(200,197,94,0.1))] flex flex-col ">
          {/* Selected user header */}
          <SelectedUserBanner />

          {/* Messages area */}
          <div className="flex-1 lg:px-16 px-4 pt-2 hide-scrollbar overflow-y-scroll ">
            <MessagesWrapper />
          </div>

          {/* Text input area */}
          <div className="w-full py-3 lg:px-16 px-4">
            <ChatInput />
          </div>
        </div>
      ) : (
        <StartChattingPopup />
      )}

      {/* {!selected_user && <StartChattingPopup />} */}
    </div>
  );
};

export default ChatSection;
