import React, { useState } from "react";
import { toast } from "react-toastify";

import { PiUserCircleCheck } from "react-icons/pi";
import { CiMail } from "react-icons/ci";
import { IoIosInformationCircleOutline } from "react-icons/io";
import useAuthStore from "../../../store/AuthStore";

const ProfileInfo = ({ fullView, editProfile }) => {
  const { authenticated_user } = useAuthStore();
  const [name, setName] = useState(authenticated_user.full_name);
  const [bio, setBio] = useState(authenticated_user.bio);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const processed_name = typeof name === "string" ? name.trim() : "";
    const processed_bio = typeof bio === "string" ? bio.trim() : "";
    if (!processed_name) {
      toast.error("Name is required.");
      return;
    }
    if (processed_name.length < 1 || processed_name.length > 40) {
      toast.error("Name is too long.");
      return;
    }
    const nameRegex =
      /^[\p{L}\p{N}' \-\p{Emoji_Presentation}\p{Extended_Pictographic}]+$/u;
    if (!nameRegex.test(processed_name)) {
      toast.error("Invalid name format.");
      return;
    }
    if (processed_bio.length > 200) {
      toast.error("Bio is too long.");
      return;
    }


  };

  // const handleNameChange = (e) => {
  //   const value = e.target.value;
  //   const nameRegex =
  //     /^[\p{L}\p{N}' \-\p{Emoji_Presentation}\p{Extended_Pictographic}]+$/u;
  //   if (!name || typeof name !== "string") setError("Name is required.");
  //   if (!nameRegex.test(value)) setError("Invalid name format.");
  //   setName(value);
  // };

  // const validateName = (name) => {
  //   // Allow letters, numbers, spaces, apostrophes, hyphens, and emojis
  //   const nameRegex =
  //     /^[\p{L}\p{N}' \-\p{Emoji_Presentation}\p{Extended_Pictographic}]+$/u;
  //   if (!name || typeof name !== "string") return false;

  //   const trimmed = name.trim();
  //   if (trimmed.length === 0 || trimmed.length > 40) return false;

  //   return nameRegex.test(trimmed);
  // };

  // const validateBio = (bio) => {
  //   if (typeof bio !== "string") return false;

  //   const trimmed = bio.trim();
  //   if (trimmed.length > 200) return false;

  //   return trimmed;
  // };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${fullView && "mt-20 "} duration-500 ${
        editProfile && "space-y-2"
      }`}
    >
      {editProfile ? (
        <div className="w-full py-3 px-4 rounded-xl relative">
          {error && (
            <p className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs text-red-500 text-center w-[500px] ">
              {error}
            </p>
          )}
          <div className="relative">
            <label
              htmlFor="full_name"
              className="text-xs text-gray-400 bg-dark_shadow px-1.5 absolute -top-2 left-2.5 font-light"
            >
              Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              placeholder="Name"
              value={name}
              maxLength={40}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 hover:ring-white/30 outline-none ring-white/10 focus:ring-purple-700 focus:ring-2 ring rounded-lg duration-300 text-white placeholder:text-xs"
            />
          </div>
        </div>
      ) : (
        <div className="w-full py-3 px-4 flex items-center text-gray-400 gap-6 hover:bg-gray-600/20 rounded-xl">
          <PiUserCircleCheck size={30} />
          <div className="space-y-1">
            <p className="text-white">{authenticated_user.full_name}</p>
            <p className="text-xs">Name</p>
          </div>
        </div>
      )}

      {editProfile ? (
        <div className="w-full py-3 px-4  rounded-xl">
          <div className="relative">
            <label
              htmlFor=""
              className="text-xs text-gray-400 bg-dark_shadow px-1.5 absolute -top-2 left-2.5 font-light"
            >
              Email
            </label>
            <input
              type="text"
              placeholder="Email"
              value={authenticated_user.email}
              className="w-full px-4 py-3 hover:ring-white/30 outline-none ring-white/10 focus:ring-purple-700 hover:cursor-not-allowed focus:ring-2 ring rounded-lg duration-300 text-white placeholder:text-xs"
              disabled={true}
            />
          </div>
        </div>
      ) : (
        <div className="w-full py-3 px-4 flex items-center text-gray-500 gap-6 hover:bg-gray-600/20 rounded-xl">
          <CiMail size={30} />
          <div className="space-y-1">
            <p className="text-white">{authenticated_user.email}</p>
            <p className="text-xs">Email</p>
          </div>
        </div>
      )}

      {editProfile ? (
        <div className="w-full py-3 px-4  rounded-xl">
          <div className="relative">
            <label
              htmlFor="bio"
              className="text-xs text-gray-400 bg-dark_shadow px-1.5 absolute -top-2 left-2.5 font-light "
            >
              Bio (optional)
            </label>
            <input
              type="text"
              name="bio"
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={200}
              className="w-full px-4 py-3 hover:ring-white/30 outline-none ring-white/10 focus:ring-purple-700 focus:ring-2 ring rounded-lg duration-300 text-white placeholder:text-xs"
            />
          </div>
        </div>
      ) : (
        <div className="w-full py-3 px-4 flex items-center text-gray-500 gap-6 hover:bg-gray-600/20 rounded-xl">
          <IoIosInformationCircleOutline size={30} />
          <div className="space-y-1">
            <p className="text-white">
              {authenticated_user.bio || (
                <span className="text-xs">Set your bio now</span>
              )}
            </p>
            <p className="text-xs">Bio</p>
          </div>
        </div>
      )}
    </form>
  );
};

export default ProfileInfo;
