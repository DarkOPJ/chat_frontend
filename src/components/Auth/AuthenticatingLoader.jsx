import React from "react";
import LottieAnimation from "../Misc/LottieAnimation";
import loading from "../../assets/animations/telejam_plane.json"

const AuthenticatingLoader = () => {
  return (
    <div className=" h-screen flex justify-center items-center overflow-hidden">
    
      <LottieAnimation
        animationLocation={loading}
        width={400}
        height={400}
      />
    </div>
  );
};

export default AuthenticatingLoader;
