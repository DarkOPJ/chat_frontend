import React, { useState } from "react";
import { toast } from "react-toastify";

import { PiUserCircleCheck } from "react-icons/pi";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { IoAtOutline } from "react-icons/io5";

import useAuthStore from "../../../store/AuthStore";
import useDebounce from "../../../hooks/useDebounce";
import useMessageStore from "../../../store/MessagesStore";

const ProfileInfo = ({ editProfile, formData, setFormData, isChatPartner }) => {
  const { authenticated_user, compare_update_data, is_updating_profile_info } =
    useAuthStore();
  const { selected_user } = useMessageStore();

  const debouncedCompare = useDebounce((data) => {
    compare_update_data(data);
  }, 1000);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    // Update form immediately
    setFormData(newFormData);

    // Debounced comparison
    debouncedCompare(newFormData);
  };

  return (
    <div className={`${editProfile && "space-y-1"}`}>
      {editProfile ? (
        <div className="w-full py-3 px-4 rounded-xl relative">
          <div className="relative">
            <label
              htmlFor="email"
              className="text-xs text-gray-500 bg-background px-1.5 absolute -top-2 left-2.5 font-light"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email"
              value={authenticated_user.email}
              className="w-full px-4 py-3 hover:ring-text/30 outline-none ring-text/10 focus:ring-full-color hover:cursor-not-allowed focus:ring-2 ring rounded-lg duration-300 text-text placeholder:text-xs text-sm"
              disabled={true}
            />
          </div>
        </div>
      ) : (
        <div className="w-full py-2 text-sm px-4 flex items-center text-gray-500 gap-6 hover:bg-hover-background rounded-xl">
          <MdOutlineMarkEmailRead size={30} />
          <div className="space-y-1">
            <p className="text-text">
              {isChatPartner ? selected_user.email : authenticated_user.email}
            </p>
            <p className="text-xs">Email</p>
          </div>
        </div>
      )}

      {editProfile ? (
        <div className="w-full py-3 px-4 rounded-xl ">
          <div className="relative">
            <label
              htmlFor="full_name"
              className="text-xs text-gray-500 bg-background px-1.5 absolute -top-2 left-2.5 font-light"
            >
              Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              placeholder="Name"
              value={formData.full_name}
              maxLength={30}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 hover:ring-text/30 outline-none ring-text/10 focus:ring-full-color focus:ring-2 ring rounded-lg duration-300 text-text placeholder:text-xs text-sm ${
                is_updating_profile_info && "hover:cursor-not-allowed"
              }`}
              disabled={is_updating_profile_info}
            />
          </div>
        </div>
      ) : (
        <div className="w-full py-2 text-sm px-4 flex items-center text-gray-500 gap-6 hover:bg-hover-background rounded-xl">
          <PiUserCircleCheck size={30} />
          <div className="space-y-1">
            <p className="text-text">
              {isChatPartner
                ? selected_user.full_name
                : authenticated_user.full_name}
            </p>
            <p className="text-xs">Name</p>
          </div>
        </div>
      )}

      {editProfile ? (
        <div className="w-full py-3 px-4 rounded-xl">
          <div className="relative">
            <label
              htmlFor="username"
              className="text-xs text-gray-500 bg-background px-1.5 absolute -top-2 left-2.5 font-light"
            >
              Username (optional)
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={formData?.username}
              onChange={handleInputChange}
              maxLength={16}
              className={`w-full px-4 py-3 hover:ring-text/30 outline-none ring-text/10 focus:ring-full-color focus:ring-2 ring rounded-lg duration-300 text-text placeholder:text-xs text-sm ${
                is_updating_profile_info && "hover:cursor-not-allowed"
              }`}
              disabled={is_updating_profile_info}
            />
          </div>
        </div>
      ) : (
        <div className="w-full py-2 text-sm px-4 flex items-center text-gray-500 gap-6 hover:bg-hover-background rounded-xl">
          <IoAtOutline size={30} />
          <div className="space-y-1">
            <p className="text-text">
              {isChatPartner
                ? selected_user.username || (
                    <span className="text-xs">Set your username</span>
                  )
                : authenticated_user.username || (
                    <span className="text-xs">Set your username</span>
                  )}
            </p>
            <p className="text-xs">Username</p>
          </div>
        </div>
      )}

      {editProfile ? (
        <div className="w-full py-3 px-4 rounded-xl">
          <div className="relative">
            <label
              htmlFor="bio"
              className="text-xs text-gray-500 bg-background px-1.5 absolute -top-2 left-2.5 font-light"
            >
              Bio (optional)
            </label>
            <input
              type="text"
              id="bio"
              name="bio"
              placeholder="Bio"
              value={formData?.bio}
              onChange={handleInputChange}
              maxLength={200}
              className={`w-full px-4 py-3 hover:ring-text/30 outline-none ring-text/10 focus:ring-full-color focus:ring-2 ring rounded-lg duration-300 text-text placeholder:text-xs text-sm ${
                is_updating_profile_info && "hover:cursor-not-allowed"
              }`}
              disabled={is_updating_profile_info}
            />
          </div>
        </div>
      ) : (
        <div className="w-full py-2 text-sm px-4 flex items-center text-gray-500 gap-6 hover:bg-hover-background rounded-xl">
          <IoIosInformationCircleOutline size={30} />
          <div className="space-y-1">
            <p className="text-text">
              {isChatPartner
                ? selected_user.bio || (
                    <span className="text-xs">Set your bio</span>
                  )
                : authenticated_user.bio || (
                    <span className="text-xs">Set your bio</span>
                  )}
            </p>
            <p className="text-xs">Bio</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;
