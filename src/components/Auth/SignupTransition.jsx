import React from "react";
import SignupExtras from "./SignupExtras";
import { IoArrowBackOutline } from "react-icons/io5";

const SignupTransition = ({ children, signupMode, correctNameAndEmail, setCorrectNameAndEmail }) => {
  return (
    <div>
      {signupMode === "name_and_email" ? (
        <div
          className={`absolute w-full top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out ${
            correctNameAndEmail
              ? "opacity-0 scale-95 pointer-events-none"
              : "opacity-100 scale-100"
          }`}
        >
          <div className="w-full space-y-10 h-[580px] flex flex-col justify-center">
            <h1 className="font-bold text-5xl">Sign Up</h1>

            {children}

            <hr className="text-stone-400" />

            <SignupExtras />
          </div>
        </div>
      ) : (
        <div
          className={`absolute w-full top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out ${
            correctNameAndEmail
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="w-full space-y-10 h-[580px] flex flex-col justify-center">
            {correctNameAndEmail && (
              <div className="w-full duration-300 ease-in-out">
                <button
                  onClick={() => setCorrectNameAndEmail(false)}
                  className="w-fit text-xl cursor-pointer hover:text-blue-400 duration-300 ease-in-out"
                >
                  <IoArrowBackOutline />
                </button>
              </div>
            )}
            <h1 className="font-bold text-5xl">Sign Up</h1>

            {children}

            <hr className="text-stone-400" />

            <SignupExtras />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupTransition;
