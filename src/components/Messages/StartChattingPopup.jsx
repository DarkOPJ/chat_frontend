import React from "react";
import ChattingAnimation from "../Misc/ChattingAnimation";

const StartChattingPopup = () => {
  return (
    <div className="flex-1 flex items-center justify-center h-full bg-[linear-gradient(135deg,rgba(99,102,241,0.1),rgba(10,10,10,0.2),rgba(200,197,94,0.1))]">
      <div className="text-center text-white py-6 px-6 bg-[rgba(49,36,65,0.32)] rounded-4xl  flex justify-center items-center animate-pulse">
        {/* <p>💬</p> */}
        <ChattingAnimation width={130} height={130} />

        <p className="text-amber-200 rounded-xl w-40">
          Start Messaging!
        </p>
      </div>
    </div>
  );
};

export default StartChattingPopup;
