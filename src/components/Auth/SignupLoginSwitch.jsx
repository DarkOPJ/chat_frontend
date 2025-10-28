import React from "react";
import { Link } from "react-router-dom";

const SignupLoginSwitch = ({className}) => {
  return (
      <p className={`text-white text-xs text-center ${className}`}>
        Have an account?{" "}
        <Link to="/login" className="font-bold ">
          Login
        </Link>
      </p>
  );
};

export default SignupLoginSwitch;
