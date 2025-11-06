import React, { useState } from "react";

import SignupNameAndEmail from "./SignupNameAndEmail";
import SignupPassword from "./SignupPassword";
import { axiosInstance } from "../../lib/Axios";
import { toast } from "react-toastify";
import AuthTransitions from "./AuthTransitions";
import useAuthStore from "../../store/AuthStore";

const SignupSection = () => {
  const { user_signup } = useAuthStore();
  const [correctNameAndEmail, setCorrectNameAndEmail] = useState(false);
  const [credentials, setCredentials] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const correctNameAndEmailHandler = (status) => {
    setCorrectNameAndEmail(status);
  };
  const nameAndEmailHandler = async (data) => {
    if (!data.full_name || !data.email) {
      toast.error("All fields are required.");
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
        error?.response?.data?.message || "Your request could not be processed."
      );
      setCorrectNameAndEmail(false);
    }
  };

  const signup = async (password_data) => {
    if (
      !credentials.full_name ||
      !credentials.email ||
      !password_data.password
    ) {
      toast.error("All fields are required.");
      return null;
    }

    user_signup(credentials, password_data);
  };

  return (
    <>
      <AuthTransitions
        mode="name_and_or_email"
        correctNameAndEmail={correctNameAndEmail}
        setCorrectNameAndEmail={correctNameAndEmailHandler}
        authType="Sign Up"
      >
        <SignupNameAndEmail nameAndEmailHandler={nameAndEmailHandler} />
      </AuthTransitions>

      <AuthTransitions
        mode="password"
        correctNameAndEmail={correctNameAndEmail}
        setCorrectNameAndEmail={correctNameAndEmailHandler}
        authType= "Sign Up"
      >
        <SignupPassword signup={signup} />
      </AuthTransitions>
    </>
  );
};

export default SignupSection;
