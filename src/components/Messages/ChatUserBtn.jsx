import React from "react";
import ProfileAvatar from "./Profile/ProfileAvatar";
import useMessageStore from "../../store/MessagesStore";

const ChatUserBtn = ({ chat = {}, contact = {} }) => {
  const { is_compact, selected_user, select_a_user } = useMessageStore();

  const id = chat._id || contact._id;
  if (!id) return; // safety
  
  return (
    <div
      onClick={() => select_a_user(chat._id ? chat : contact)}
      key={chat._id || contact._id}
      className={`${id === selected_user?._id && "bg-purple-500/15"} p-4 hover:bg-gray-500/15 cursor-pointer   flex items-center gap-3 rounded-xl duration-300`}
    >
      <ProfileAvatar
        seed={chat.full_name || contact.full_name}
        name={chat.full_name || contact.full_name}
        profile_pic={chat.profile_pic || contact.profile_pic}
      />
      {!is_compact && (
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline">
            <h3 className="font-semibold text-white truncate">
              {chat.full_name || contact.full_name}
            </h3>
            {chat && !is_compact && (
              <span className="text-xs text-gray-500 ml-2">
                {chat.time || "10m"}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">
            {chat.lastMessage || contact.status || "Yet to do"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatUserBtn;
