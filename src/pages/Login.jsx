import React from 'react'
import WelcomeMessage from "../components/Auth/WelcomeMessage";
import LoginSection from "../components/Auth/LoginSection";

const Login = () => {
  return (
    <div className="text-white w-full h-full absolute inset-0 grid md:grid-cols-[40%_15%_45%] grid-cols-1 grid-rows-[53%_28%] md:grid-rows-1">
      <WelcomeMessage>
        <h1 className="font-bold lg:text-5xl md:text-3xl duration-300 ">
          Seamless<br />
          <span className="bg-gradient-to-l from-[#7d12ff] to-[rgb(197,145,255)] bg-clip-text text-transparent">
            Communication
          </span>
        </h1>
      </WelcomeMessage>

      <div className="md:bg-[linear-gradient(to_left,_#160430_10%,_rgba(0,0,0,0)_100%)] bg-[linear-gradient(to_top,_#240b48_0%,_rgba(0,0,0,0)_50%)]"></div>

      <div className="md:bg-dark_purple bg-normal_purple w-full relative">
        <LoginSection />
      </div>
    </div>
  )
}

export default Login