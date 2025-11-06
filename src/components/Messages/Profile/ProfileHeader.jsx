import React from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { FiEdit3 } from "react-icons/fi";
import { TbRosetteDiscountCheck } from "react-icons/tb";
import useAuthStore from "../../../store/AuthStore";

const ProfileHeader = ({
  openCloseHandler,
  title,
  setIsMainProfile,
  handleSubmit,
  isChatPartner,
}) => {
  const { profile_editted, is_updating_profile_info } = useAuthStore();
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
      {title === "Profile" ? (
        isChatPartner ? (
          <></>
        ) : (
          <button
            className="cursor-pointer hover:bg-gray-600/20 p-2 rounded-full text-gray-400 text-xl duration-300 "
            onClick={setIsMainProfile}
          >
            <FiEdit3 />
          </button>
        )
      ) : (
        <button
          className={`  p-2 rounded-full ${
            profile_editted && !is_updating_profile_info
              ? "hover:bg-gray-600/20 text-green-400 cursor-pointer"
              : "text-gray-500/50 cursor-not-allowed"
          } text-2xl duration-300 `}
          onClick={handleSubmit}
          disabled={!profile_editted || is_updating_profile_info}
        >
          <TbRosetteDiscountCheck />
        </button>
      )}
    </div>
  );
};

export default ProfileHeader;
