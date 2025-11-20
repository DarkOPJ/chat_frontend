import React, { useEffect } from "react";
import Message from "./Message";
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
    streaming_message,
    subscribe_to_ai_streaming,
    unsubscribe_from_ai_streaming,
  } = useMessageStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    get_messages_by_id();
    subscribe_to_messages();
    subscribe_to_ai_streaming();

    // cleanup function
    return () => {
      unsubscribe_from_messages();
      unsubscribe_from_ai_streaming();
    };
  }, [selected_user._id]);

  useEffect(() => {
    // For scrolling to the end
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [all_messages_by_id, streaming_message]);

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
        all_messages_by_id.length || streaming_message ? (
          <>
            {all_messages_by_id.map((msg, index) => {
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
                  isRead={msg.is_read}
                  isOptimistic={msg.is_optimistic || false}
                />
              );
            })}

            {/* Streaming message */}
            {streaming_message && (
              <Message
                key={streaming_message._id}
                leftOrRight="left"
                image={null}
                text={streaming_message.text}
                sentTime={formatTime(streaming_message.createdAt)}
                isSkeleton={false}
                showProfilePic={true}
                isStreaming={true}
              />
            )}
          </>
        ) : (
          <NoMessageSent />
        )
      ) : (
        [...Array(7)].map((_, idx) => (
          <Message
            key={idx}
            leftOrRight={idx % 2 == 1 ? "left" : "right"}
            image={""}
            text={""}
            sentTime={""}
            isSkeleton={true}
          />
        ))
      )}
      <div ref={messageEndRef} />
    </div>
  );
};

export default MessagesWrapper;
