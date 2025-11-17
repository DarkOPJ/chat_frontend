import React from "react";
import ProfileAvatar from "./Profile/ProfileAvatar";
import useMessageStore from "../../store/MessagesStore";
import useApplicationStore from "../../store/ApplicationStore";
import useAuthStore from "../../store/AuthStore";
import formatConversationTime from "../../lib/MessageTimeFormat";
import { FaRegFileImage } from "react-icons/fa6";

const ChatUserBtn = ({ chat = {}, contact = {} }) => {
  const { selected_user, select_a_user } = useMessageStore();
  const { is_compact } = useApplicationStore();
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
      className={`${id === selected_user?._id && "bg-purple-500/15"} ${
        is_compact ? "px-3.5" : "px-4"
      } py-4 hover:bg-gray-500/15 cursor-pointer flex items-center gap-3 rounded-xl duration-300`}
    >
      <ProfileAvatar
        seed={partner_details?.full_name || contact?.full_name}
        name={partner_details?.full_name || contact?.full_name}
        profile_pic={partner_details?.profile_pic || contact?.profile_pic}
      />
      {!is_compact && (
        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex justify-between items-baseline">
            <h3 className="font-semibold text-white truncate">
              {partner_details?.full_name || contact?.full_name}
            </h3>
            {!is_compact &&
              (partner_details?._id ? (
                <span className="text-xs text-gray-500 ml-2">
                  {formatConversationTime(chat?.updated_at)}
                </span>
              ) : (
                <></>
              ))}
          </div>
          <div className="text-gray-500  flex items-center gap-1.5">
            {chat?.last_message?.image && (
              <p>
                <FaRegFileImage />
              </p>
            )}
            <p className="text-sm truncate">
              {partner_details?._id
                ? chat?.last_message?.text || "photo"
                : contact?._id &&
                  (online_users.includes(id) ? "online" : "offline")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatUserBtn;
