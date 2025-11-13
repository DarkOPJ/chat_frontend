import React, { useEffect } from "react";
import Message from "./Message";
import useAuthStore from "../../store/AuthStore";
import useMessageStore from "../../store/MessagesStore";
import NoMessageSent from "./NoMessageSent";
import { useRef } from "react";

const MessagesWrapper = () => {
  const {
    selected_user,
    get_messages_by_id,
    all_messages_by_id,
    is_loading_messages,
    subscribe_to_messages,
    unsubscribe_from_messages,
  } = useMessageStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    get_messages_by_id();
    subscribe_to_messages();

    // cleanup function
    return () => unsubscribe_from_messages();
  }, [selected_user._id]);

  useEffect(() => {
    // For scrolling to the end
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [all_messages_by_id]);

  const formatTime = (createdAt) => {
    const date = new Date(createdAt);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="w-full space-y-2 h-full">
      {!is_loading_messages ? (
        all_messages_by_id.length ? (
          all_messages_by_id.map((msg, index) => {
            // Check if this is the last message OR if the next message is from a different sender
            const isLastInGroup =
              index === all_messages_by_id.length - 1 ||
              all_messages_by_id[index + 1].sender_id !== msg.sender_id;

            return (
              <Message
                key={msg._id.toString()}
                leftOrRight={
                  selected_user._id === msg.sender_id ? "left" : "right"
                }
                image={msg.image}
                text={msg.text}
                sentTime={formatTime(msg.createdAt)}
                isSkeleton={false}
                showProfilePic={isLastInGroup}
              />
            );
          })
        ) : (
          <NoMessageSent />
        )
      ) : (
        [...Array(7)].map((_, idx) => (
          <Message
            key={idx}
            leftOrRight={idx % 2 == 1 ? "left" : "right"}
            image={""}
            text={"Hello"}
            sentTime={"10:28"}
            isSkeleton={true}
          />
        ))
      )}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessagesWrapper;
