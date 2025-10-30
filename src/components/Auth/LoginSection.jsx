import React, { useState } from "react";

import { axiosInstance } from "../../lib/Axios";
import { toast } from "react-toastify";
import AuthTransitions from "./AuthTransitions";
import useAuthStore from "../../store/AuthStore";
import LoginEmail from "./LoginEmail";
import LoginPassword from "./LoginPassword";

const LoginSection = () => {
  const { user_login } = useAuthStore();
  // Below is for correct email. not name and email.
  const [correctNameAndEmail, setCorrectNameAndEmail] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const correctNameAndEmailHandler = (status) => {
    setCorrectNameAndEmail(status);
  };

  const emailHandler = async (data) => {
    if (!data.email) {
      toast.error("All fields are required.");
      return null;
    }

    try {
      const res = await axiosInstance.post("/auth/login_check", data);
      // Check if the response was successful (2xx)
      if (res.status >= 200 && res.status < 300) {
        setCredentials({
          ...credentials,
          email: data.email,
        });
        setCorrectNameAndEmail(true);
      } else {
        toast.error(res.data.message || "Your request could not be processed.");
        setCorrectNameAndEmail(false);
      }
    } catch (error) {
      toast.error(
        error.response.data.message || "Your request could not be processed."
      );
      setCorrectNameAndEmail(false);
    }
  };

  const passwordHandler = async (password_data) => {
    if (!credentials.email || !password_data.password) {
      toast.error("All fields are required.");
      return null;
    }

    user_login(credentials, password_data);
  };

  return (
    <>
      <AuthTransitions
        mode="name_and_or_email"
        correctNameAndEmail={correctNameAndEmail}
        setCorrectNameAndEmail={correctNameAndEmailHandler}
        authType="Login"
      >
        <LoginEmail emailHandler={emailHandler} />
      </AuthTransitions>

      <AuthTransitions
        mode="password"
        correctNameAndEmail={correctNameAndEmail}
        setCorrectNameAndEmail={correctNameAndEmailHandler}
        authType="Login"
      >
        <LoginPassword handlePassword={passwordHandler} />
      </AuthTransitions>
    </>
  );
};

export default LoginSection;
