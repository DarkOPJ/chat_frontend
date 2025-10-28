import React, { useState } from "react";


import SignupNameAndEmail from "./SignupNameAndEmail";
import SignupPassword from "./SignupPassword";
import { axiosInstance } from "../../lib/Axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SignupTransition from "./SignupTransition";

const SignupSection = () => {
  const [correctNameAndEmail, setCorrectNameAndEmail] = useState(false);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const correctNameAndEmailHandler = (status) => {
    setCorrectNameAndEmail(status);
  }
  const nameAndEmailHandler = async (data) => {
    if (!data.full_name || !data.email) {
      toast.error("Please provide both full name and email.");
      return null;
    }

    try {
      const res = await axiosInstance.post("/auth/signup_check", data);
      // Check if the response was successful (2xx)
      if (res.status >= 200 && res.status < 300) {
        toast.success("Great! Proceed to set your password.");
        setCredentials({
          ...credentials,
          full_name: data.full_name,
          email: data.email,
        });
        setCorrectNameAndEmail(true);
      } else {
        toast.error(res.data.message || "Your request could not be processed.");
        setCorrectNameAndEmail(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Your request could not be processed."
      );
      setCorrectNameAndEmail(false);
    }
  };

  const passwordHandler = async (data) => {
    if (!credentials.full_name || !credentials.email || !data.password) {
      toast.error("Please provide both full name and email.");
      return null;
    }

    try {
      const new_user = {
        ...credentials,
        password: data.password,
      };
      const res = await axiosInstance.post("/auth/signup", new_user);
      // Check if the response was successful (2xx)
      if (res.status >= 200 && res.status < 300) {
        toast.success("Welcome to Telejam! 😁");
        setCorrectNameAndEmail(false);
        // navigate(`/${res.data._id}`);
      } else {
        toast.error(res.data.message || "Your request could not be processed.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Your request could not be processed."
      );
    }
  };

  return (
    <>
      <SignupTransition
        signupMode="name_and_email"
        correctNameAndEmail={correctNameAndEmail}
        setCorrectNameAndEmail={correctNameAndEmailHandler}
      >
        <SignupNameAndEmail nameAndEmailHandler={nameAndEmailHandler} />
      </SignupTransition>

      <SignupTransition
        signupMode="password"
        correctNameAndEmail={correctNameAndEmail}
        setCorrectNameAndEmail={correctNameAndEmailHandler}
      >
        <SignupPassword handlePassword={passwordHandler} />
      </SignupTransition>
    </>
  );
};

export default SignupSection;
