import React from "react";
import ProfileAvatar from "./Profile/ProfileAvatar";
import useMessageStore from "../../store/MessagesStore";
import useApplicationStore from "../../store/ApplicationStore";
import useAuthStore from "../../store/AuthStore";
import formatConversationTime from "../../lib/MessageTimeFormat";
import { IoCamera } from "react-icons/io5";
import { LuAudioLines } from "react-icons/lu";
import Badge from "./Badge";

const ChatUserBtn = ({ chat = {}, contact = {} }) => {
  const { selected_user, select_a_user, unread_counts } = useMessageStore();
  const { is_compact, theme } = useApplicationStore();
  const { online_users } = useAuthStore();
  const id = chat?.partner?._id || contact?._id;
  const partner_details = chat?.partner;
  if (!id) return; // safety

  // Format of each chat
  // {
  //   _id: "conv_id",
  //   partner: { _id, name, profile_pic, last_seen, ... },
  //   last_message: { text, sender_id, image, createdAt },
  //   updated_at: Date
  // },

  return (
    <div
      onClick={() =>
        select_a_user(partner_details?._id ? partner_details : contact)
      }
      key={partner_details?._id || contact?._id}
      className={`${
        id === selected_user?._id ? "bg-full-color/90" : "hover:bg-gray-500/22"
      } ${
        is_compact ? "px-3 py-2" : "px-2 py-3"
      }  cursor-pointer flex items-center gap-3 rounded-xl duration-300`}
    >
      <div className="relative">
        <ProfileAvatar
          seed={partner_details?.full_name || contact?.full_name}
          name={partner_details?.full_name || contact?.full_name}
          profile_pic={partner_details?.profile_pic || contact?.profile_pic}
        />
        {is_compact && chat?.last_message && unread_counts[chat._id] > 0 && (
          <div className="absolute -top-0.5 -right-2.5">
            <Badge
              selected={id === selected_user?._id}
              text={`${unread_counts[chat._id]}`}
            />
          </div>
        )}
      </div>
      {!is_compact && (
        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex justify-between items-baseline">
            <h3
              className={`font-medium text-text truncate ${
                id === selected_user?._id ? "text-white" : ""
              }`}
            >
              {partner_details?.full_name || contact?.full_name}
            </h3>
            {!is_compact && partner_details?._id && (
              <span
                className={`text-xs ml-2 ${
                  id === selected_user?._id ? "text-white" : "text-gray-500"
                }`}
              >
                {formatConversationTime(chat?.updated_at)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between gap-2 text-x">
            <div
              className={`flex items-center gap-1.5 ${
                id === selected_user?._id ? "text-white" : "text-gray-500"
              }`}
            >
              {chat?.last_message?.image && <IoCamera className="text-lg" />}
              {chat?.last_message?.audio && (
                <LuAudioLines className="text-lg" />
              )}
              <p className="text-sm truncate max-w-[165px]">
                {partner_details?._id
                  ? chat?.last_message?.text
                    ? chat?.last_message?.text
                    : chat?.last_message?.image
                    ? "photo"
                    : chat?.last_message?.audio && "audio"
                  : contact?._id &&
                    (online_users.includes(id) ? "online" : "offline")}
              </p>
            </div>
            {chat?.last_message && unread_counts[chat._id] > 0 && (
              <Badge
                selected={id === selected_user?._id}
                text={`${unread_counts[chat._id]}`}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatUserBtn;
