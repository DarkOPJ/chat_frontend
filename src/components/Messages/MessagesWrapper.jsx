import React, { useEffect } from "react";
import Message from "./Message";
import useAuthStore from "../../store/AuthStore";
import useMessageStore from "../../store/MessagesStore";

const MessagesWrapper = () => {
  const { authenticated_user } = useAuthStore();
  const {
    selected_user,
    get_messages_by_id,
    all_messages_by_id,
    is_loading_messages,
  } = useMessageStore();

  const formatTime = (createdAt) => {
  const date = new Date(createdAt);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

  useEffect(() => {
    get_messages_by_id(selected_user._id.toString());
  }, [get_messages_by_id, selected_user._id]);

  return (
    <div className="w-full space-y-2">
      {all_messages_by_id.map((msg) => (
        <Message
          key={msg._id}
          leftOrRight={selected_user._id === msg.sender_id ? "left" : "right"}
          image={msg.image}
          text={msg.text}
          sentTime={formatTime(msg.createdAt)}
        />
      ))}
    </div>
  );
};

export default MessagesWrapper;
