// import React, { useEffect } from "react";
// import {
//   createBrowserRouter,
//   Navigate,
//   RouterProvider,
// } from "react-router-dom";
// import AuthLayout from "./layouts/AuthLayout";
// import Signup from "./pages/Signup";
// import ChatPage from "./pages/ChatPage";
// import Login from "./pages/Login";
// import useAuthStore from "./store/AuthStore";
// import AuthenticatingLoader from "./components/Auth/AuthenticatingLoader";

// const Router = () => {
//   const { authenticated_user, check_authentication_state, is_authenticating } =
//     useAuthStore();

//   useEffect(() => {
//     check_authentication_state();
//   }, []);

//   if (is_authenticating) return <AuthenticatingLoader />;

//   const router = createBrowserRouter([
//     {
//       path: "/",
//       element: authenticated_user ? (
//         <ChatPage />
//       ) : (
//         <Navigate to={"/login"} replace />
//       ),
//     },
//     {
//       path: "/",
//       element: <AuthLayout />,
//       children: [
//         {
//           path: "signup",
//           element: !authenticated_user ? (
//             <Signup />
//           ) : (
//             <Navigate to={"/"} replace />
//           ),
//         },
//         {
//           path: "login",
//           element: !authenticated_user ? (
//             <Login />
//           ) : (
//             <Navigate to={"/"} replace />
//           ),
//         },
//       ],
//     },
//   ]);

//   return <RouterProvider router={router} />;
// };

// export default Router;


import React, { useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Signup from "./pages/Signup";
import ChatPage from "./pages/ChatPage";
import Login from "./pages/Login";
import useAuthStore from "./store/AuthStore";
import AuthenticatingLoader from "./components/Auth/AuthenticatingLoader";

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { authenticated_user } = useAuthStore();
  return authenticated_user ? children : <Navigate to="/login" replace />;
};

// Public Route Wrapper
const PublicRoute = ({ children }) => {
  const { authenticated_user } = useAuthStore();
  return !authenticated_user ? children : <Navigate to="/" replace />;
};

// Define router OUTSIDE component
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "signup",
        element: (
          <PublicRoute>
            <Signup />
          </PublicRoute>
        ),
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
      path: "*",
      element: <Navigate to="/" replace />,
    },
    ],
  },
]);

const Router = () => {
  const { check_authentication_state, is_authenticating } = useAuthStore();

  useEffect(() => {
    check_authentication_state();
  }, []);

  if (is_authenticating) return <AuthenticatingLoader />;

  return <RouterProvider router={router} />;
};

export default Router;