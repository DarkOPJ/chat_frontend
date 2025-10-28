import React from "react";
import { Outlet } from "react-router-dom";
import space from "../assets/images/space.jpg";
import telejam2 from "../assets/images/telejam2.png";
import AuthNavbar from "../components/Auth/AuthNavbar";
const AuthLayout = () => {
  return (
    <section className="h-screen relative md:bg-dark_purple bg-normal_purple">
      <div className="hidden md:block w-full  fixed px-10 py-6 z-10">
        <img className="w-[130px]" src={telejam2} alt="Telejam Logo" />
      </div>
      <AuthNavbar />

      <div className="h-full w-full relative overflow-hidden">
        <div className="relative">
          <img
            className="absolute md:static md:block md:h-screen min-w-[850px] md:max-w-none top-0 right-0 h-[600px] md:object-[-30px_-0px] scale-x-[-1] md:scale-x-[1]"
            src={space}
            alt="Space"
          />
        </div>
        <Outlet />
      </div>
      <div className="hidden md:block absolute bottom-0 left-0 w-full h-[134px] bg-[linear-gradient(to_top,_#160430_0%,_rgba(0,0,0,0)_100%)] z-10"></div>
      <div className="w-full h-16 md:bg-dark_purple bg-normal_purple"></div>
    </section>
  );
};

export default AuthLayout;
