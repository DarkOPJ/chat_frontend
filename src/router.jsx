import React from "react";
import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Signup from "./pages/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [{ path: "signup", element: <Signup /> }],
  },
]);

export default router;
