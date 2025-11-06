import React, { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileAvatar from "./ProfileAvatar";
import ProfileInfo from "./ProfileInfo";
import useAuthStore from "../../../store/AuthStore";

const EditProfile = ({ openCloseHandler, setIsMainProfile }) => {
  const { authenticated_user, update_profile_info } = useAuthStore();
  const [formData, setFormData] = useState({
    full_name: authenticated_user.full_name,
    username: authenticated_user.username,
    bio: authenticated_user.bio,
  });
  const [error, setError] = useState("");

  let errorTimeout;
  const showError = (msg, setError) => {
    // Clear any previous timer
    if (errorTimeout) clearTimeout(errorTimeout);
    // Set new error
    setError(msg);
    // Start a new 6s timer to clear
    errorTimeout = setTimeout(() => {
      setError("");
    }, 6000);
  };

  const handleSubmit = () => {
    const processed_name =
      typeof formData.full_name === "string" ? formData.full_name.trim() : "";
    const processed_username =
      typeof formData.username === "string" ? formData.username.trim() : "";
    const processed_bio =
      typeof formData.bio === "string" ? formData.bio.trim() : "";
    // Name
    if (!processed_name) {
      showError("Name is required.", setError);
      return;
    }
    if (processed_name.length < 3 || processed_name.length > 30) {
      showError("Name must be 3 - 30 characters.", setError);
      return;
    }
    const nameRegex =
      /^[\p{L}\p{N}' \-\p{Emoji}\p{Emoji_Component}]+$/u;
    if (!nameRegex.test(processed_name)) {
      showError("Invalid name format.", setError);
      return;
    }
    // Username
    if (processed_username) {
      if (processed_username.length < 3 || processed_username.length > 16) {
        showError("Username must be 3 - 16 characters.", setError);
        return;
      }
      const usernameRegex = /^[a-zA-Z0-9._-]+$/;
      if (!usernameRegex.test(processed_username)) {
        showError(
          "Invalid username format. Use only letters, digits, and ._-",
          setError
        );
        return;
      }
    }
    // Bio
    if (processed_bio) {
      if (processed_bio.length > 200) {
        showError("Bio must be 3 - 200 characters.", setError);
        return;
      }
    }

    const update_data = {
      full_name: processed_name,
      username: processed_username,
      bio: processed_bio,
    };

    update_profile_info(update_data);
  };

  return (
    <div className="space-y-2">
      <ProfileHeader
        openCloseHandler={openCloseHandler}
        title={"Edit Profile"}
        setIsMainProfile={setIsMainProfile}
        handleSubmit={handleSubmit}
      />

      <div className="w-full h-60 flex justify-center items-center text-center  ">
        <div className=" h-full aspect-square  flex flex-col gap-3 justify-center items-center duration-300 relative">
          <ProfileAvatar
            profile_pic={authenticated_user.profile_pic}
            seed={authenticated_user._id}
            name={authenticated_user.full_name}
            edit={true}
            fullView={false}
            size={"large"}
          />
          <div>
            <p className="text-white text-xl text-center">
              {authenticated_user.full_name}
            </p>
          </div>
        </div>
      </div>

      <div
        className={`${error && "mt-5"} relative transition-all duration-500`}
      >
        {error && (
          <p className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs text-red-500 text-center w-[500px] ">
            {error}
          </p>
        )}
        <ProfileInfo
          editProfile={true}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
    </div>
  );
};

export default EditProfile;
