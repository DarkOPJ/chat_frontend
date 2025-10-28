import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";

const SignupExtras = () => {
  return (
    <div className="space-y-4">
      <p className="text-stone-400 text-xs">Or continue with</p>

      <div className="flex gap-2 text-center">
        <Link
          to="#"
          className="w-full p-3 block rounded-xl text-sm bg-[#3B2063] "
        >
          <FcGoogle className="inline text-xl mr-2 -mt-1" />
          Google
        </Link>
        <Link
          to="#"
          className="w-full p-3 text-sm block rounded-xl bg-[#3B2063] "
        >
          <FaFacebook className="inline text-xl bg-white rounded-full outline -outline-offset-1 mr-2 -mt-1 text-[#0A66C2]" />
          Facebook
        </Link>
      </div>

      <p className="text-stone-400 text-xs ">
        By registering you with our{" "}
        <Link to="#" className="text-[#9D5CE9]">
          Terms and Conditions
        </Link>
      </p>
    </div>
  );
};

export default SignupExtras;
