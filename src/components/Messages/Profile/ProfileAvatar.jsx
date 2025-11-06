import React, { useMemo, useRef, useState } from "react";
import { TbCameraPlus } from "react-icons/tb";
import { getAvatarInitials, handleImage } from "../../../lib/ProfileFunctions";

const ProfileAvatar = ({
  seed,
  name,
  profile_pic = "",
  size = "normal",
  fullView = false,
  edit = false,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const imageRef = useRef();

  // size is "small", "normal", "large"
  const sizeStyling = (sizeToUse) => {
    if (sizeToUse === "small") {
      return "size-6 text-xs";
    } else if (sizeToUse === "large") {
      return "size-32 text-4xl";
    } else {
      return "size-12";
    }
  };

  const gradientColors = useMemo(() => {
    const colors = [
      ["from-blue-500", "to-purple-600"],
      ["from-pink-500", "to-rose-600"],
      ["from-green-500", "to-emerald-600"],
      ["from-orange-500", "to-red-600"],
      ["from-cyan-500", "to-blue-600"],
      ["from-violet-500", "to-purple-600"],
      ["from-amber-500", "to-orange-600"],
      ["from-teal-500", "to-cyan-600"],
      ["from-indigo-500", "to-blue-600"],
      ["from-fuchsia-500", "to-pink-600"],
    ];

    // Use seed to consistently select the same color for the same user
    const index = seed
      ? seed.toString().charCodeAt(0) % colors.length
      : Math.floor(Math.random() * colors.length);
    return colors[index];
  }, [seed]);

  return (
    <div
      className={`${sizeStyling(size)} ${fullView ? " size-full" : ""}  ${
        !profile_pic && "bg-linear-to-br"
      } ${gradientColors[0]} ${
        gradientColors[1]
      } flex items-center justify-center text-white font-semibold rounded-full duration-500 ease-in-out shrink-0 cursor-default relative overflow-hidden`}
    >
      {edit && (
        <button
          onClick={() => imageRef.current.click()}
          className="absolute inset-0 z-10 bg-black/70 rounded-full flex justify-center items-center text-5xl duration-300 opacity-0 hover:opacity-100 cursor-pointer"
        >
          <TbCameraPlus />
        </button>
      )}
      {selectedImage || profile_pic ? (
        <img
          src={selectedImage || profile_pic}
          alt="User image"
          className="size-full object-cover rounded-full"
        />
      ) : (
        getAvatarInitials(name)
      )}

      {edit && (
        <input
          type="file"
          accept="image/png, image/jpeg"
          id=""
          name=""
          ref={imageRef}
          onChange={(e) => handleImage(e, setSelectedImage)}
          hidden={true}
        />
      )}
    </div>
  );
};

export default ProfileAvatar;
