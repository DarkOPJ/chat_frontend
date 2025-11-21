import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import useAuthStore from "../../store/AuthStore";

const AuthExtras = () => {
  const { user_oauth } = useAuthStore();

  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {
      user_oauth(code);
    },
    onError: () => {
      toast.error("There was a problem with the Google login.");
    },
    flow: "auth-code",
  });

  return (
    <div className="space-y-4">
      <p className="text-stone-400 text-xs text-center">Or continue with</p>

      <div className="flex gap-2 text-center">
        <button
          type="button"
          onClick={login}
          className="w-full p-3 block rounded-xl text-sm bg-[#3B2063] hover:bg-[#4b2d83] duration-300 cursor-pointer"
        >
          <FcGoogle className="inline text-xl mr-2 -mt-1" />
          Google
        </button>
        <button
          type="button"
          onClick={() => console.log("Facebook login.")}
          className="w-full p-3 text-sm block rounded-xl bg-[#3B2063] hover:bg-[#4b2d83] duration-300 cursor-pointer"
        >
          <FaFacebook className="inline text-xl bg-white rounded-full outline -outline-offset-1 mr-2 -mt-1 text-[#0A66C2]" />
          Facebook
        </button>
      </div>

      <p className="text-stone-400 text-xs">
        By using Telejam, you are agreeing to our{" "}
        <Link to="#" className="text-[#9D5CE9]">
          Terms and Conditions
        </Link>
      </p>
    </div>
  );
};

export default AuthExtras;
