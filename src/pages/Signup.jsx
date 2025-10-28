import React from "react";

import WelcomeMessage from "../components/WelcomeMessage";
import SignupSection from "../components/Auth/SignupSection";

const Signup = () => {
  return (
    <div className="text-white w-full h-full grid grid-cols-[40%_15%_40%]">
      <WelcomeMessage>
        <h1 className="font-bold text-5xl ">
          Join Telejam <br />
          <span className="bg-gradient-to-l from-[#7d12ff] to-[rgb(197,145,255)] bg-clip-text text-transparent">
            Today
          </span>
        </h1>
      </WelcomeMessage>

      <div className="bg-[linear-gradient(to_left,_#160430_20%,_rgba(0,0,0,0)_100%)]"></div>

      <div className="bg-dark_purple w-full p-4 relative">
        <SignupSection />
      </div>
    </div>
  );
};

export default Signup;
