import React from "react";

const ExpandImageMessage = ({ image, text }) => {
  return (
    <div className="wfull h-full bg-black/50">
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
              className="text-center px-6 py-1 text-sm bg-gray-900 text-white wrap-anywhere max-h-20 overflow-y-auto hide-chat-input-scrollbar"
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
