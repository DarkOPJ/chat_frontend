import React from "react";
import { MdOutlineMusicNote, MdOutlineMusicOff } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import useAuthStore from "../../store/AuthStore";

const SoundLogoutBtns = () => {
  const {logout} = useAuthStore()
  return (
    <div className="flex gap-1 text-xl">
      <button
        onClick={(e) => {
          e.preventDefault();
          console.log("Sound");
        }}
        className="cursor-pointer hover:bg-gray-500/20 text-stone-300 p-2 rounded-full duration-300"
      >
        <MdOutlineMusicNote />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          logout()
        }}
        className="cursor-pointer hover:bg-gray-500/20 text-stone-300 p-2 rounded-full duration-300"
      >
        <FiLogOut />
      </button>
    </div>
  );
};

export default SoundLogoutBtns;
