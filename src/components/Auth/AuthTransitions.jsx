import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import AuthExtras from "./AuthExtras";

const AuthTransitions = ({ children, mode, correctNameAndEmail, setCorrectNameAndEmail, authType }) => {
  return (
    <div>
      {mode === "name_and_or_email" ? (
        <div
          className={`absolute px-8 lg:pl-8 lg:pr-12 md:pl-5 md:pr-6 w-full md:top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out ${
            correctNameAndEmail
              ? "opacity-0 scale-95 pointer-events-none"
              : "opacity-100 scale-100"
          }`}
        >
          <div className="w-full md:space-y-10 space-y-6 h-[580px] flex flex-col justify-center ">
            <h1 className="font-bold text-5xl">{authType}</h1>

            {children}

            <hr className="text-stone-400" />

            <AuthExtras />
          </div>
        </div>
      ) : (
        <div
          className={`absolute px-8 lg:pl-8 lg:pr-12 md:pl-5 md:pr-6 w-full md:top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out ${
            correctNameAndEmail
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="w-full md:space-y-10 space-y-6 h-[580px] flex flex-col justify-center">
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
            <h1 className="font-bold text-5xl">{authType}</h1>

            {children}

            <hr className="text-stone-400" />

            <AuthExtras />
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthTransitions;
