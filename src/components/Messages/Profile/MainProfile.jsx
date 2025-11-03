import React, { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileAvatar from "../ProfileAvatar";
import ProfileInfo from "./ProfileInfo";
import useAuthStore from "../../../store/AuthStore";

const MainProfile = ({openCloseHandler, setIsMainProfile}) => {
  const { authenticated_user } = useAuthStore();
  const [fullView, setFullView] = useState(false);

  return (
    <div className="space-y-8">
      <ProfileHeader openCloseHandler={openCloseHandler} title={"Profile"} setIsMainProfile={setIsMainProfile}/>

      <div className="w-full mt-10 h-60 flex justify-center items-center text-center  ">
        <div
          onClick={() => setFullView((prev) => !prev)}
          className=" h-full aspect-square  flex flex-col gap-3 justify-center items-center duration-300  relative"
        >
          <ProfileAvatar
            fullView={fullView}
            size={"large"}
            seed={authenticated_user._id}
            name={authenticated_user.full_name}
          />
          <div>
            <p className="text-white text-xl text-center">
              {authenticated_user.full_name}
            </p>
            <p className="text-gray-500 text-center text-sm">Online</p>
          </div>
        </div>
      </div>

      <ProfileInfo fullView={fullView} editProfile={false}/>
    </div>
  );
};

export default MainProfile;
