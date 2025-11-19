// import Router from "./Router";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const App = () => {
//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={true}
//         newestOnTop={false}
//         closeOnClick
//         pauseOnHover
//         draggable
//         theme="dark" // "light" | "dark" | "colored"
//       />
//       {/* toast.success("Signup successful!");
//         toast.error("Invalid credentials.");
//         toast.info("Processing request...");
//         toast.warn("Network unstable!"); */}

//       <Router />
//     </>
//   );
// };

// export default App;

import React, { useEffect } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthLayout from "./layouts/AuthLayout";
import Signup from "./pages/Signup";
import ChatPage from "./pages/ChatPage";
import Login from "./pages/Login";
import useAuthStore from "./store/AuthStore";
import AuthenticatingLoader from "./components/Auth/AuthenticatingLoader";
import useApplicationStore from "./store/ApplicationStore";

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

const App = () => {
  const { check_authentication_state, is_authenticating } = useAuthStore();
  const { hydrate, theme } = useApplicationStore();

  useEffect(() => {
    check_authentication_state();

    hydrate();
  }, []);

  if (is_authenticating) return <AuthenticatingLoader className={`${theme}`} />;

  return (
    <section className={`${theme} transition-colors duration-300`}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme={theme === "light" ? "light" : "dark"}
      />
      <RouterProvider router={router} />
    </section>
  );
};

export default App;
