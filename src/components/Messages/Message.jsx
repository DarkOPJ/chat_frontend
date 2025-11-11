import React, { useState } from "react";
import ProfileAvatar from "./Profile/ProfileAvatar";
import useAuthStore from "../../store/AuthStore";
import useMessageStore from "../../store/MessagesStore";
import { getTextColorFromSeed } from "../../lib/ColorUtils";
import PortalBackground from "../Misc/PortalBackground";
import { createPortal } from "react-dom";
import ExpandImageMessage from "./ExpandImageMessage";
import { AiOutlineCloudDownload } from "react-icons/ai";

const Message = ({
  leftOrRight = "",
  text = "",
  image = "",
  sentTime = "",
  isSkeleton = false,
  showProfilePic,
}) => {
  const { authenticated_user } = useAuthStore();
  const { selected_user, handleDownload } = useMessageStore();
  const [toggleFullScreen, setToggleFullScreen] = useState(false);
  const textColor = getTextColorFromSeed(selected_user.full_name);

  return (
    <div className={`w-[80%] ${leftOrRight === "right" && "ml-auto"}`}>
      <div
        className={`flex gap-1.5 items-end max-w-[350px] ${
          leftOrRight === "right" && "ml-auto"
        }`}
      >
        <div className={`${leftOrRight === "right" && "order-2"}`}>
          {!isSkeleton ? (
            showProfilePic ? (
              <ProfileAvatar
                size="small"
                profile_pic={
                  leftOrRight === "left"
                    ? selected_user.profile_pic
                    : authenticated_user.profile_pic
                }
                name={
                  leftOrRight === "left"
                    ? selected_user.full_name
                    : authenticated_user.full_name
                }
                seed={
                  leftOrRight === "left"
                    ? selected_user.full_name
                    : authenticated_user.full_name
                }
              />
            ) : (
              <div className="size-6" />
            )
          ) : (
            <div className="size-6 rounded-full animate-pulse bg-slate-700/70" />
          )}
        </div>

        <div
          className={`${
            isSkeleton && "bg-slate-800/60 animate-pulse"
          } text-white px-2 py-2 rounded-t-2xl space-y-1 text-sm ${
            leftOrRight === "left"
              ? "rounded-r-2xl bg-dark_shadow/80"
              : "rounded-l-2xl bg-purple-800/80 ml-auto"
          } relative`}
        >
          {leftOrRight === "left" &&
            (!isSkeleton ? (
              <p className={`text-xs leading-none ${textColor}`}>
                {selected_user.full_name}
              </p>
            ) : (
              <div className="w-16 p-1.5 animate-pulse bg-slate-600/70 rounded-sm" />
            ))}
          <div>
            {/* Portal for displaying full image */}
            {toggleFullScreen &&
              createPortal(
                <PortalBackground
                  openCloseHandler={() => setToggleFullScreen(false)}
                >
                  <ExpandImageMessage image={image} text={text} />
                </PortalBackground>,
                document.getElementById("backdrop-root")
              )}

            {image && !isSkeleton && (
              <div className="relative">
                <img
                  className="w-full rounded-xl object-contain mb-1.5 cursor-pointer"
                  src={image}
                  alt="Shared image."
                  onClick={() => setToggleFullScreen(true)}
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 duration-300 bg-black/35 text-white/35 hover:bg-black hover:text-white p-1 rounded-full cursor-pointer"
                  onClick={() => handleDownload(image)}
                >
                  <AiOutlineCloudDownload />
                </button>
              </div>
            )}

            {text && !isSkeleton && <p className="wrap-anywhere">{text}</p>}

            {isSkeleton && (
              <div className=" space-y-1">
                <div className="w-40 p-1.5 animate-pulse bg-slate-600/70 rounded-sm" />
                <div className="w-32 p-1.5 animate-pulse bg-slate-600/70 rounded-sm" />
              </div>
            )}
          </div>
          {sentTime && !isSkeleton ? (
            <p className="text-xs leading-none ml-auto w-fit">{sentTime}</p>
          ) : (
            <div className="w-5 p-1 animate-pulse bg-slate-600/70 rounded-xs ml-auto" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
