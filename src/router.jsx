import React, { useEffect } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Signup from "./pages/Signup";
import ChatPage from "./pages/ChatPage";
import Login from "./pages/Login";
import useAuthStore from "./store/AuthStore";

const Router = () => {
  const { authenticated_user, check_authentication_state } =
    useAuthStore();

  useEffect(() => {
    check_authentication_state();
  }, [check_authentication_state]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: authenticated_user ? <ChatPage /> : <Navigate to={"/login"} replace />,
    },
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        { path: "signup", element: !authenticated_user ? <Signup /> : <Navigate to={"/"} replace />},
        { path: "login", element: !authenticated_user ? <Login /> : <Navigate to={"/"} replace /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
