import React from "react";
import useMessageStore from "../../store/MessagesStore";
import useAuthStore from "../../store/AuthStore";
import useApplicationStore from "../../store/ApplicationStore";

const NoMessageSent = () => {
  const { authenticated_user } = useAuthStore();
  const { send_message_by_id } = useMessageStore();
  const { theme } = useApplicationStore();

  const handleSend = (message) => {
    if (!message.trim()) return;

    const new_message = {
      text: message,
      image: "",
    };

    send_message_by_id(new_message, true);
  };

  return (
    <div className="w-full h-full flex justify-center items-center text-white">
      <div className="text-center py-6 px-6 bg-[#31244134] backdrop-blur-xs rounded-2xl space-y-3 leading-none animate-pulse ">
        <p>No messages here yet...</p>
        <p className="font-light text-sm">
          Send a message or select a quick message starter!
        </p>

        <div className="space-x-2">
          <button
            type="button"
            onClick={() => handleSend("👋🏾 Hey")}
            className="cursor-pointer py-2 px-3 rounded-full bg-right-bubble text-text text-sm"
          >
            👋🏾 Hey
          </button>
          <button
            type="button"
            onClick={() =>
              handleSend(
                `🙂‍↕️ ${authenticated_user.full_name.slice(
                  0,
                  1
                )}. here, what's up?`
              )
            }
            className="cursor-pointer py-2 px-3 rounded-full bg-right-bubble text-text text-sm"
          >
            🙂‍↕️ {authenticated_user.full_name.slice(0, 1)}. here, what's up?
          </button>
          <button
            type="button"
            onClick={() => handleSend("🔥 Brooo")}
            className="cursor-pointer py-2 px-3 rounded-full bg-right-bubble text-text text-sm"
          >
            🔥 Brooo
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoMessageSent;
