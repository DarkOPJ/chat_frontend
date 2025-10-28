import React, { useEffect, useState } from "react";
import { IoKeyOutline } from "react-icons/io5";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { Link } from "react-router-dom";

const SignupPassword = ({ handlePassword }) => {
  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    const passwordData = {
      password: password,
    };
    handlePassword(passwordData);
  };

  const checkPassword = (password) => {
    if (typeof password !== "string") return false;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,64}$/;
    return passwordRegex.test(password);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPasswordValid(password ? checkPassword(password) : null);
    }, 500);
    return () => clearTimeout(timeout);
  }, [password]);

  return (
    <form
      className="space-y-6 duration-300 ease-in-out"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm block leading-none">
          Password
        </label>
        <div className="w-full relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-4 text-xl text-stone-400">
            <IoKeyOutline />
          </div>
          <div className="absolute flex justify-center items-center top-1/2 -translate-y-1/2 right-4 text-xl text-stone-400">
            <button className="cursor-pointer hover:text-blue-400 duration-300 ease-in-out"
              onClick={(e) => {
                e.preventDefault();
                setPasswordVisible((prevState) => !prevState);
              }}
            >
              {passwordVisible ? <TbEyeClosed /> : <TbEye />}
            </button>
          </div>

          <input
            className="bg-[#261046] w-full py-4 px-12 outline-0 rounded-xl leading-0 text-sm block"
            type={passwordVisible ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>

      <button
        className={`w-full p-4 block rounded-xl cursor-pointer disabled:cursor-not-allowed ${
          passwordValid
            ? "bg-[linear-gradient(to_left,_#501794,_#3E70A1)]"
            : "bg-gray-600"
        }`}
        disabled={!passwordValid}
      >
        Sign Up
      </button>

      <p className="text-stone-400 text-xs text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-300">
          Login
        </Link>
      </p>
    </form>
  );
};

export default SignupPassword;
