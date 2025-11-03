import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { FiEdit3 } from "react-icons/fi";

const ProfileHeader = ({ openCloseHandler, title, setIsMainProfile }) => {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-10">
        <button
          className="cursor-pointer hover:bg-gray-600/20 p-2 rounded-full text-gray-400 text-xl duration-300 "
          onClick={title === "Profile" ? openCloseHandler : setIsMainProfile}
        >
          <IoArrowBackOutline />
        </button>
        <p className="text-white text-xl">{title}</p>
      </div>
      {title === "Profile" && (
        <button
          className="cursor-pointer hover:bg-gray-600/20 p-2 rounded-full text-gray-400 text-xl duration-300 "
          onClick={setIsMainProfile}
        >
          <FiEdit3 />
        </button>
      )}
    </div>
  );
};

export default ProfileHeader;
