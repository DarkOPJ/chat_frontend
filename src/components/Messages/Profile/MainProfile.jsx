import React, { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileAvatar from "./ProfileAvatar";
import ProfileInfo from "./ProfileInfo";
import useAuthStore from "../../../store/AuthStore";
import { BsDot } from "react-icons/bs";
import useMessageStore from "../../../store/MessagesStore";

const MainProfile = ({ openCloseHandler, setIsMainProfile, isChatPartner }) => {
  const { authenticated_user } = useAuthStore();
  const { selected_user } = useMessageStore();
  const [fullView, setFullView] = useState(false);

  return (
    <div className="space-y-11">
      <ProfileHeader
        openCloseHandler={openCloseHandler}
        title={"Profile"}
        setIsMainProfile={setIsMainProfile}
        isChatPartner={isChatPartner}
      />

      <div className="w-full h-60 flex justify-center items-center text-center  ">
        <div
          onClick={() => setFullView((prev) => !prev)}
          className=" h-full aspect-square  flex flex-col gap-3 justify-center items-center duration-300  relative"
        >
          <ProfileAvatar
            profile_pic={isChatPartner ? selected_user.profile_pic : authenticated_user.profile_pic}
            fullView={fullView}
            size={"large"}
            seed={isChatPartner ? selected_user.full_name : authenticated_user.full_name}
            name={
              isChatPartner
                ? selected_user.full_name
                : authenticated_user.full_name
            }
          />
          <div>
            <p className="text-white text-xl text-center">
              {isChatPartner
                ? selected_user.full_name
                : authenticated_user.full_name}
            </p>
            <p className="flex items-center justify-center gap-1 text-gray-500 text-sm">
              {!isChatPartner && authenticated_user.username && (
                <>
                  @{authenticated_user.username}
                  <BsDot className="text-lg" />
                </>
              )}
              {isChatPartner && selected_user.username && (
                <>
                  @{selected_user.username}
                  <BsDot className="text-lg" />
                </>
              )}
              Online
            </p>{" "}
          </div>
        </div>
      </div>

      <ProfileInfo editProfile={false} isChatPartner={isChatPartner}/>
    </div>
  );
};

export default MainProfile;
