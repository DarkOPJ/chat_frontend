import React from "react";
import telejam2 from "../../assets/images/telejam2.png";
import SignupLoginSwitch from "./SignupLoginSwitch";

const AuthNavbar = () => {
  return (
    <div className="w-full fixed md:hidden p-4 z-10 bg-[linear-gradient(to_bottom,_#000_0%,_rgba(0,0,0,0)_100%)] flex justify-between items-center">
      <img className="w-20 custom-md:w-28" src={telejam2} alt="Telejam Logo" />
      <SignupLoginSwitch className={"font-extralight leading-none"}/>
    </div>
  );
};

export default AuthNavbar;
