import React from "react";
import Avatar from "./ProfileAvatar";

const ChatUserBtn = ({ chat = {}, contact = {}, isCompact }) => {
  return (
    <div
      key={chat.id || contact.id}
      className="p-4 hover:bg-gray-500/15 cursor-pointer  flex items-center gap-3 rounded-xl duration-300"
    >
      <Avatar seed={chat.id || contact.id}>{chat.avatar || contact.avatar}</Avatar>
      {!isCompact && (
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <h3 className="font-semibold text-white truncate">{chat.name || contact.name}</h3>
            {chat && (
              <span className="text-xs text-gray-500 ml-2">{chat.time}</span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">
            {chat.lastMessage || contact.status}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatUserBtn;
