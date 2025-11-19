import React from "react";
import useApplicationStore from "../../store/ApplicationStore";

const ExpandImageMessage = ({ image, text }) => {
  const { theme } = useApplicationStore();
  return (
    <div className={`${theme} wfull h-full bg-black/50 backdrop-blur-xs`}>
      <div className="max-w-4xl md h-full m-auto py-8 flex flex-col justify-evenly">
        <div className="max-h-[500px]">
          <img
            className="max-h-[500px] m-auto"
            src={image}
            alt="Shared image."
          />
        </div>
        {text && (
          <div>
            <p
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="text-center px-6 py-1 text-sm bg-background text-text wrap-anywhere max-h-20 overflow-y-auto hide-chat-input-scrollbar"
            >
              {text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpandImageMessage;
