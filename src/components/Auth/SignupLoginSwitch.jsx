import React from "react";
import { Link, useLocation } from "react-router-dom";

const SignupLoginSwitch = ({ className }) => {
  const location = useLocation();
  const isSignup = location.pathname.includes("signup");

  return (
    <p className={`text-white text-xs text-center ${className}`}>
      {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
      <Link
        to={isSignup ? "/login" : "/signup"}
        className="font-bold hover:text-blue-400 duration-300"
      >
        {isSignup ? "Login" : "Sign Up"}
      </Link>
    </p>
  );
};

export default SignupLoginSwitch;
