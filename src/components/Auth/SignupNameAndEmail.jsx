import React, { useState, useEffect } from "react";
import { CiMail, CiUser } from "react-icons/ci";
import { Link } from "react-router-dom";
import SignupLoginSwitch from "./SignupLoginSwitch";

const SignupNameAndEmail = ({ nameAndEmailHandler }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [fullNameValid, setFullNameValid] = useState(null);
  const [emailValid, setEmailValid] = useState(null);

  const checkFullName = (name) => {
    if (typeof name !== "string") return false;
    const trimmed = name.trim();

    // Must contain at least two alphabetic parts, separated by exactly one space, hyphen, or apostrophe
    const nameRegex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)+$/;
    // Reject consecutive spaces, hyphens, or apostrophes
    if (/([ '\-])\1/.test(trimmed)) return false;

    return nameRegex.test(trimmed);
  };

  const checkEmail = (email) => {
    if (typeof email !== "string") return false;
    const trimmed = email.trim();

    const emailRegex =
      /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(trimmed);
  };

  const validCredentials = () => {
    return fullNameValid && emailValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here

    const nameAndEmail = {
      full_name: fullName,
      email: email,
    };

    if (validCredentials()) {
      nameAndEmailHandler(nameAndEmail);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFullNameValid(fullName ? checkFullName(fullName) : null);
    }, 500);
    return () => clearTimeout(timeout);
  }, [fullName]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setEmailValid(email ? checkEmail(email) : null);
    }, 500);
    return () => clearTimeout(timeout);
  }, [email]);

  return (
    <form
      className="space-y-6 duration-300 ease-in-out"
      onSubmit={handleSubmit}
    >
      <div className="space-y-2">
        <label htmlFor="full_name" className="text-sm block leading-none">
          Full Name
        </label>
        <div className="w-full relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-4 text-xl text-stone-400">
            <CiUser />
          </div>

          <input
            className="md:bg-[#261046] bg-[#190733] w-full custom-md:py-4 py-3 px-12 outline-0 rounded-xl leading-0 text-sm block"
            type="text"
            id="full_name"
            name="full_name"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm block leading-none">
          E-mail
        </label>
        <div className="w-full relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-4 text-xl text-stone-400">
            <CiMail />
          </div>
          <input
            className="md:bg-[#261046] bg-[#190733] w-full custom-md:py-4 py-3 px-12 outline-0 rounded-xl leading-0 text-sm block"
            type="email"
            id="email"
            name="email"
            placeholder="youremail@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <button
        className={`w-full custom-md:p-4 p-3 block rounded-xl cursor-pointer disabled:cursor-not-allowed ${
          validCredentials()
            ? "bg-[linear-gradient(to_left,_#501794,_#3E70A1)]"
            : "bg-gray-600"
        }`}
        disabled={!validCredentials()}
      >
        Proceed
      </button>
      <div className="md:block hidden">
        <SignupLoginSwitch />
      </div>
    </form>
  );
};

export default SignupNameAndEmail;
