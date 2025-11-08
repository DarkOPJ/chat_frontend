import React from "react";
import ProfileAvatar from "./Profile/ProfileAvatar";
import useAuthStore from "../../store/AuthStore";
import useMessageStore from "../../store/MessagesStore";
import { getTextColorFromSeed } from "../../lib/ColorUtils";

const Message = ({
  leftOrRight="",
  text = "",
  image = "",
  sentTime = "",
  isSkeleton = false,
}) => {
  const { authenticated_user } = useAuthStore();
  const { selected_user } = useMessageStore();
  const textColor = getTextColorFromSeed(selected_user.full_name);

  return (
    <div className={`w-[80%] ${leftOrRight === "right" && "ml-auto"}`}>
      <div
        className={`flex gap-1.5 items-end max-w-[500px] ${
          leftOrRight === "right" && "ml-auto"
        }`}
      >
        <div className={`${leftOrRight === "right" && "order-2"}`}>
          {!isSkeleton ? (
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
            <div className="size-6 rounded-full animate-pulse bg-slate-700/70"></div>
          )}
        </div>
        <div
          className={`${isSkeleton && "bg-slate-800/60 animate-pulse" } text-white px-3 py-2 rounded-t-2xl space-y-1 text-sm ${
            leftOrRight === "left"
              ? "rounded-r-2xl bg-dark_shadow/80"
              : "rounded-l-2xl bg-purple-800/80 ml-auto"
          } relative`}
        >
          {leftOrRight === "left" &&
            (!isSkeleton ? (
              <p className={`text-sm leading-none ${textColor}`}>
                {selected_user.full_name}
              </p>
            ) : (
              <div className="w-16 p-1.5 animate-pulse bg-slate-600/70 rounded-sm" />
            ))}
          <div>
            {image && !isSkeleton && <img src={image} alt="" />}{" "}
            {text && !isSkeleton ? (
              <p>{text}</p>
            ) : (
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
          {/* <div className={`absolute right-0 bottom-0 w-0 h-0 border-t-10 border-t-purple-600 border-l-10 border-l-transparent`}></div> */}
          {/* <div className={`absolute size-4 bg-black 
            ${leftOrRight === "left" ? "right-full bottom-0 " : "left-full bottom-0"}`}></div> */}
          {/* <div
          className={`absolute size-4 bg-black rounded-2xl 
            ${
              leftOrRight === "left"
                ? "right-full bottom-0 "
                : "left-full bottom-0"
            }`}
          style={{
            clipPath: "polygon(0 0, 0 100%, 100% 100%)",
          }}
        ></div> */}
          {/* <svg
          className="absolute right-full top-0"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path d="M0,0 L8,0 Q0,0 0,13 Z" fill="rgb(147, 51, 234)" />
        </svg> */}
          {/* <div className="chat-left-bottom"></div> */}
        </div>
      </div>
    </div>
  );
};

export default Message;
