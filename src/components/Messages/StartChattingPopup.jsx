import React from "react";
import LottieAnimation from "../Misc/LottieAnimation";
import textingAnimation from "../../assets/animations/texting.json";
const StartChattingPopup = () => {
  return (
    <div className="flex-1 flex items-center justify-center h-full ">
      <div className="text-center text-white py-6 px-6 bg-[rgba(49,36,65,0.32)] rounded-4xl  flex justify-center items-center animate-pulse">
        {/* <p>💬</p> */}
        <LottieAnimation
          animationLocation={textingAnimation}
          width={130}
          height={130}
        />

        <p className="text-amber-200 rounded-xl w-40">Start Messaging!</p>
      </div>
    </div>
  );
};

export default StartChattingPopup;
