import React from "react";
import useApplicationStore from "../../store/ApplicationStore";

const ModalWrapper = ({ children, className }) => {
  const { theme } = useApplicationStore();
  return (
    <section
      className={`${theme} fixed inset-0 z-40 md:py-16 px-4 py-6 flex justify-center items-center transition-opacity duration-300 backdrop-blur-xs`}
      style={{ pointerEvents: "none" }}
    >
      <div
        className={`${className} rounded-2xl md:w-[600px] w-[500px] overflow-hidden overflow-y-auto p-4`}
        style={{
          pointerEvents: "auto",
        }}
      >
        {children}
      </div>
    </section>
  );
};

export default ModalWrapper;
