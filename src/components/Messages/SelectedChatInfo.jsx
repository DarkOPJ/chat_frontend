import React from "react";
import { useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import PortalBackground from "../Misc/PortalBackground";
import Profile from "./Profile/Profile";
import { createPortal } from "react-dom";

const SelectedChatInfo = () => {
    const [toggleProfile, setToggleProfile] = useState(false)

  return (
    <>
      <button
        onClick={() => setToggleProfile(true)}
        className="cursor-pointer hover:bg-gray-500/15 text-stone-400 p-2 rounded-full duration-300 text-2xl"
      >
        <HiOutlineDotsVertical />
      </button>

      {toggleProfile &&
          createPortal(
            <PortalBackground openCloseHandler={() => setToggleProfile(false)}>
              <Profile isChatPartner={true} openCloseHandler={() => setToggleProfile(false)} />
            </PortalBackground>,
            document.getElementById("backdrop-root")
          )}
    </>
  );
};

export default SelectedChatInfo;
