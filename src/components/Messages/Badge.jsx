import React from "react";
import useApplicationStore from "../../store/ApplicationStore";

const Badge = ({ text, selected = false }) => {
  const { theme } = useApplicationStore();
  return (
    <p
      className={`${
        theme === "light"
          ? selected
            ? "bg-white text-full-color"
            : "bg-full-color text-text-opposite"
          : selected
          ? "bg-white text-full-color"
          : "bg-full-color"
      }  text-center min-w-8 rounded-full py-1 px-1 leading-none font-normal text-xs truncate`}
    >
      {text}
    </p>
  );
};

export default Badge;
