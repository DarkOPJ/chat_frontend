import React from "react";
import LottieAnimation from "../Misc/LottieAnimation";
import textingAnimation from "../../assets/animations/texting.json";
const StartChattingPopup = () => {
  return (
    <div className="flex-1 flex items-center justify-center h-full ">
      <div className="text-center text-text p-8 bg-[#31244134] backdrop-blur-xs rounded-2xl flex justify-center items-center animate-pulse">
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
