import React from "react";
import useMessageStore from "../../store/MessagesStore";
import useAuthStore from "../../store/AuthStore";

const NoMessageSent = () => {
  const { authenticated_user } = useAuthStore();
  const { selected_user, send_message_by_id } = useMessageStore();

  const handleSend = (message) => {
    if (!message.trim()) return;

    const new_message = {
      text: message,
      image: "",
    };

    send_message_by_id(selected_user._id, new_message);
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="text-center text-white py-6 px-6 bg-[rgba(49,36,65,0.32)] rounded-4xl space-y-3 leading-none animate-pulse">
        <p>No messages here yet...</p>
        <p className="font-light text-sm">
          Send a message or select a quick message starter!
        </p>

        <div className="space-x-2">
          <button
            type="button"
            onClick={() => handleSend("👋🏾 Hey")}
            className="cursor-pointer py-2 px-3 rounded-full bg-amber-400/12 text-sm"
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
            className="cursor-pointer py-2 px-3 rounded-full bg-amber-400/12 text-sm"
          >
            🙂‍↕️ {authenticated_user.full_name.slice(0, 1)}. here, what's up?
          </button>
          <button
            type="button"
            onClick={() => handleSend("🔥 Brooo")}
            className="cursor-pointer py-2 px-3 rounded-full bg-amber-400/12 text-sm"
          >
            🔥 Brooo
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoMessageSent;
