import React from "react";

const Badge = ({ text }) => {
  return (
    <p className="text-white text-center min-w-8 bg-purple-500/80 rounded-full py-1 px-1 leading-none font-normal text-xs truncate">
      {text}
    </p>
  );
};

export default Badge;
