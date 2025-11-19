import React, { useState } from "react";
import ModalWrapper from "../../Misc/ModalWrapper";

import MainProfile from "./MainProfile";
import EditProfile from "./EditProfile";

const Profile = ({ openCloseHandler, isChatPartner = false }) => {
  const [isMainProfile, setIsMainProfile] = useState(true);

  const handleToggle = () => {
    setTimeout(() => {
      setIsMainProfile((prev) => !prev);
    }, 100);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <ModalWrapper className={"bg-background h-full overflow-hidden"}>
        <div className="relative w-full h-full">
          {/* MainProfile */}
          <div
            className="absolute inset-0 transition-transform duration-300 ease-in-out"
            style={{
              transform: isMainProfile ? "translateX(0)" : "translateX(-105%)",
            }}
          >
            <MainProfile
              isChatPartner={isChatPartner}
              openCloseHandler={openCloseHandler}
              setIsMainProfile={handleToggle}
            />
          </div>

          {/* EditProfile */}
          {!isChatPartner && (
            <div
              className="absolute inset-0 transition-transform duration-300 ease-in-out"
              style={{
                transform: isMainProfile ? "translateX(105%)" : "translateX(0)",
              }}
            >
              <EditProfile
                openCloseHandler={openCloseHandler}
                setIsMainProfile={handleToggle}
              />
            </div>
          )}
        </div>
      </ModalWrapper>
    </div>
  );
};

export default Profile;
