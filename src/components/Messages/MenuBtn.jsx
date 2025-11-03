import React from "react";

const MenuBtn = ({ children, func, args }) => {
  return (
    <button
      onClick={() => {
        if (args) {
          func(args);
        } else {
          func();
        }
      }}
      className="w-full cursor-pointer hover:bg-gray-500/20 text-stone-300 px-4 py-2.5 rounded-lg duration-300 flex items-center gap-5"
    >
      {children}
    </button>
  );
};

export default MenuBtn;
