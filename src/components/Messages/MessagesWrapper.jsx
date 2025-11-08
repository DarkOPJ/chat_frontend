import React, { useEffect } from "react";
import Message from "./Message";
import useAuthStore from "../../store/AuthStore";
import useMessageStore from "../../store/MessagesStore";

const MessagesWrapper = () => {
  const {
    selected_user,
    get_messages_by_id,
    all_messages_by_id,
    is_loading_messages,
  } = useMessageStore();

  const formatTime = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    get_messages_by_id(selected_user._id.toString());
  }, [get_messages_by_id, selected_user._id]);

  return (
    <div className="w-full space-y-2">
      {!is_loading_messages
        ? all_messages_by_id.map((msg) => (
            <Message
              key={msg._id.toString()}
              leftOrRight={
                selected_user._id === msg.sender_id ? "left" : "right"
              }
              image={msg.image}
              text={msg.text}
              sentTime={formatTime(msg.createdAt)}
              isSkeleton={false}
            />
          ))
        : // all_messages_by_id.map((msg) => (
          //   <Message
          //     key={msg._id.toString()}
          //     leftOrRight={selected_user._id === msg.sender_id ? "left" : "right"}
          //     image={msg.image}
          //     text={msg.text}
          //     sentTime={formatTime(msg.createdAt)}
          //   />
          // ))

          [...Array(7)].map((_, idx) => (
            <Message
              key={idx}
              leftOrRight={idx % 2 == 1 ? "left" : "right"}
              image={""}
              text={"Hello"}
              sentTime={"10:28"}
              isSkeleton={true}
            />
          ))}
    </div>
  );
};

export default MessagesWrapper;
