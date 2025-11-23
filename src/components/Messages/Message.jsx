import React, { useState } from "react";
import ProfileAvatar from "./Profile/ProfileAvatar";
import useAuthStore from "../../store/AuthStore";
import useMessageStore from "../../store/MessagesStore";
import { getTextColorFromSeed } from "../../lib/ColorUtils";
import PortalBackground from "../Misc/PortalBackground";
import { createPortal } from "react-dom";
import ExpandImageMessage from "./ExpandImageMessage";
import { AiOutlineCloudDownload } from "react-icons/ai";
import {
  PiChecksBold,
  PiCheckBold,
  PiClockCountdownBold,
} from "react-icons/pi";

import useApplicationStore from "../../store/ApplicationStore";
import AudioPlayer from "./AudioPlayer";

const Message = ({
  leftOrRight = "",
  text = "",
  image = "",
  audio = "",
  sentTime = "",
  isSkeleton = false,
  showProfilePic,
  isStreaming = false,
  isRead = false,
  isOptimistic = false,
}) => {
  const { authenticated_user } = useAuthStore();
  const { selected_user, handleDownloadImage } = useMessageStore();
  const { theme } = useApplicationStore();
  const [toggleFullScreen, setToggleFullScreen] = useState(false);
  const textColor = getTextColorFromSeed(selected_user.full_name);

  return (
    <div className={`w-[80%] ${leftOrRight === "right" && "ml-auto"}`}>
      <div
        className={`flex gap-1.5 items-end max-w-[350px] relative ${
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
            <div
              className={`size-6 rounded-full animate-pulse ${
                theme === "light" ? "bg-text/30" : "bg-full-color/40"
              }`}
            />
          )}
        </div>

        <div
          className={`
            ${
              isSkeleton &&
              ` ${
                theme === "light" ? "bg-text/30" : "bg-full-color/40"
              } animate-pulse`
            } 
          text-text rounded-t-[15px] space-y-0.5 text-sm ${
            isSkeleton
              ? leftOrRight === "left"
                ? "rounded-r-[15px] p-2"
                : "rounded-l-[15px] ml-auto p-2"
              : leftOrRight === "left"
              ? "rounded-r-[15px] bg-left-bubble px-0.5 pt-0.5 pb-1"
              : "rounded-l-[15px] bg-right-bubble ml-auto px-0.5 pt-0.5 pb-1"
          } relative`}
        >
          {leftOrRight === "left" &&
            (!isSkeleton ? (
              <p
                className={`text-xs min-w-20 px-2 pt-1 leading-none ${textColor}`}
              >
                {selected_user.full_name}
              </p>
            ) : (
              <div
                className={`w-16 p-1.5 mb-1 animate-pulse ${
                  theme === "light"
                    ? "bg-left-bubble/25"
                    : "bg-sub-background/45"
                }  rounded-sm`}
              />
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
              <div className={`relative ${leftOrRight === "left" && "mt-1.5"}`}>
                <img
                  className={`w-full ${
                    leftOrRight === "right" && "rounded-t-[14px]"
                  }  object-contain mb-1.5 cursor-pointer`}
                  src={image}
                  alt="Shared image."
                  onClick={() => setToggleFullScreen(true)}
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 duration-300 bg-background/35 text-text/35 hover:bg-background hover:text-text p-1 rounded-full cursor-pointer"
                  onClick={() => handleDownloadImage(image)}
                >
                  <AiOutlineCloudDownload />
                </button>
              </div>
            )}

            {text && !isSkeleton && (
              <p
                className={`${
                  leftOrRight === "right" && !image && "pt-1.5"
                } wrap-anywhere whitespace-pre-wrap text-text min-w-20 px-2 py-1 leading-[18px]`}
              >
                {text}

                {isStreaming && (
                  <span className="inline-block ml-1 animate-pulse">▋</span>
                )}
              </p>
            )}

            {audio && !isSkeleton && (
              <AudioPlayer leftOrRight={leftOrRight} audioUrl={audio} />
            )}

            {isSkeleton && (
              <div className="space-y-1">
                <div
                  className={`w-40 p-1.5 animate-pulse ${
                    theme === "light"
                      ? "bg-left-bubble/45"
                      : "bg-sub-background/60"
                  } rounded-sm`}
                />
                <div
                  className={`w-32 p-1.5 animate-pulse ${
                    theme === "light"
                      ? "bg-left-bubble/45"
                      : "bg-sub-background/60"
                  } rounded-sm`}
                />
              </div>
            )}
          </div>

          {sentTime && !isSkeleton ? (
            !isStreaming && (
              <div
                className={`flex gap-1.5 items-center min-w-20 px-1 ${
                  audio && "absolute right-0.5 bottom-1"
                }`}
              >
                <p
                  className={`${
                    leftOrRight === "left" && "px-1"
                  } ml-auto w-fit text-[10px]`}
                >
                  {sentTime}
                </p>
                {leftOrRight === "right" &&
                  (isOptimistic ? (
                    <PiClockCountdownBold />
                  ) : selected_user.full_name === "Orion✨" || isRead ? (
                    <PiChecksBold className="text-deep text-base duration-300" />
                  ) : (
                    <PiCheckBold />
                  ))}
              </div>
            )
          ) : (
            <div
              className={`w-5 p-1 animate-pulse ${
                theme === "light" ? "bg-left-bubble/25" : "bg-sub-background/45"
              } rounded-xs ml-auto`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
