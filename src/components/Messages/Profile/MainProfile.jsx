import React, { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileAvatar from "./ProfileAvatar";
import ProfileInfo from "./ProfileInfo";
import useAuthStore from "../../../store/AuthStore";
import { BsDot } from "react-icons/bs";
import useMessageStore from "../../../store/MessagesStore";
import formatLastSeen from "../../../lib/LastSeen";

const MainProfile = ({ openCloseHandler, setIsMainProfile, isChatPartner }) => {
  const { authenticated_user, online_users } = useAuthStore();
  const { selected_user } = useMessageStore();
  const [fullView, setFullView] = useState(false);

  return (
    <div className="space-y-12">
      <ProfileHeader
        openCloseHandler={openCloseHandler}
        title={"Profile"}
        setIsMainProfile={setIsMainProfile}
        isChatPartner={isChatPartner}
      />

      <div className="w-full h-60 flex justify-center items-center text-center">
        <div
          onClick={() => setFullView((prev) => !prev)}
          className="h-full aspect-square flex flex-col gap-3 justify-center items-center duration-300  relative"
        >
          <ProfileAvatar
            profile_pic={
              isChatPartner
                ? selected_user.profile_pic
                : authenticated_user.profile_pic
            }
            fullView={fullView}
            size={"large"}
            seed={
              isChatPartner
                ? selected_user.full_name
                : authenticated_user.full_name
            }
            name={
              isChatPartner
                ? selected_user.full_name
                : authenticated_user.full_name
            }
          />
          <div className="space-y-1">
            <p className="text-text text-xl text-center">
              {isChatPartner
                ? selected_user.full_name
                : authenticated_user.full_name}
            </p>
            <div className=" text-gray-500 text-xs leading-none">
              {!isChatPartner
                ? authenticated_user.username && <p>@{authenticated_user.username}</p>
                : selected_user.username && <p>@{selected_user.username}</p>}
            </div>
            <p className="text-gray-500 text-xs leading-none">
              {isChatPartner
                ? online_users.includes(selected_user._id)
                  ? "online"
                  : formatLastSeen(selected_user.last_seen).toLowerCase()
                : "online"}
            </p>{" "}
          </div>
        </div>
      </div>

      <ProfileInfo editProfile={false} isChatPartner={isChatPartner} />
    </div>
  );
};

export default MainProfile;
