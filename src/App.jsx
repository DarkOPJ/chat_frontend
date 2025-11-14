import Router from "./Router.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
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

      <Router />
    </>
  );
}

export default App;
