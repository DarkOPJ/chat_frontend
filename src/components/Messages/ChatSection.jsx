import React from "react";
import background1 from "../../assets/images/chatbg1.png";
import StartChattingPopup from "./StartChattingPopup";

import useMessageStore from "../../store/MessagesStore";
import SelectedUserBanner from "./SelectedUserBanner";

const ChatSection = () => {
  const { open_sidebar, selected_user } = useMessageStore();

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
        <div className="w-full h-full">
          <SelectedUserBanner />
        </div>
      ) : (
        <StartChattingPopup />
      )}

      {/* {!selected_user && <StartChattingPopup />} */}
    </div>
  );
};

export default ChatSection;
