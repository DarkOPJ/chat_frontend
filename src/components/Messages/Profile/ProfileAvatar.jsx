import React, { useMemo, useRef, useState } from "react";
import { TbCameraPlus } from "react-icons/tb";
import { getAvatarInitials, handleImage } from "../../../lib/ProfileFunctions";
import { getGradientFromSeed } from "../../../lib/ColorUtils";

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
  const [fromColor, toColor] = getGradientFromSeed(seed);

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

  return (
    <div
      className={`${sizeStyling(size)} ${fullView ? "size-full" : ""}  ${
        !profile_pic && "bg-linear-to-br"
      } ${fromColor} ${toColor} flex items-center justify-center text-white font-medium rounded-full duration-500 ease-in-out shrink-0 cursor-default relative overflow-hidden`}
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
        <p className={`duration-500 ease-in-out ${fullView && "text-6xl"}`}>{getAvatarInitials(name)}</p>
      )}

      {edit && (
        <input
          type="file"
          accept="image/png, image/jpeg"
          id=""
          name=""
          ref={imageRef}
          onChange={(e) => handleImage(e, setSelectedImage, "profile_pic")}
          hidden={true}
        />
      )}
    </div>
  );
};

export default ProfileAvatar;
