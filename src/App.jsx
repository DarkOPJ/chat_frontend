import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark" // "light" | "dark" | "colored"
      />
      {/* toast.success("Signup successful!");
        toast.error("Invalid credentials.");
        toast.info("Processing request...");
        toast.warn("Network unstable!"); */}

      <RouterProvider router={router} />
    </>
  );
}

export default App;
