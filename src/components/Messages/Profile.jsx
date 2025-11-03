

import React, { useState } from "react";
import ModalWrapper from "../Misc/ModalWrapper";

import MainProfile from "./Profile/MainProfile";
import EditProfile from "./Profile/EditProfile";

const Profile = ({ openCloseHandler }) => {
  const [isMainProfile, setIsMainProfile] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleToggle = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsMainProfile(prev => !prev);
      setIsTransitioning(false);
    }, 100);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ModalWrapper className={"bg-dark_shadow h-full overflow-hidden"}>
        <div className="relative w-full h-full">
          {/* MainProfile */}
          <div
            className="absolute inset-0 transition-transform duration-300 ease-in-out"
            style={{
              transform: isMainProfile 
                ? 'translateX(0)' 
                : 'translateX(-105%)',
            }}
          >
            <MainProfile
              openCloseHandler={openCloseHandler}
              setIsMainProfile={handleToggle}
            />
          </div>

          {/* EditProfile */}
          <div
            className="absolute inset-0 transition-transform duration-300 ease-in-out"
            style={{
              transform: isMainProfile 
                ? 'translateX(105%)' 
                : 'translateX(0)',
            }}
          >
            <EditProfile
              openCloseHandler={openCloseHandler}
              setIsMainProfile={handleToggle}
            />
          </div>
        </div>
      </ModalWrapper>
    </div>
  );
};

export default Profile;