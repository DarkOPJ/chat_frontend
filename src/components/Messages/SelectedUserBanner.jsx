import React from "react";
import { MdOutlineCall } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";

import ProfileAvatar from "./Profile/ProfileAvatar";
import useMessageStore from "../../store/MessagesStore";
import { createPortal } from "react-dom";
import PortalBackground from "../Misc/PortalBackground";
import Profile from "./Profile/Profile";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useState } from "react";
import useAuthStore from "../../store/AuthStore";
import formatLastSeen from "../../lib/LastSeen";

const SelectedUserBanner = () => {
  const { set_open_sidebar, selected_user, select_a_user } = useMessageStore();
  const {online_users} = useAuthStore()
  const [toggleProfile, setToggleProfile] = useState(false);

  return (
    <div className="px-3 py-1 bg-background flex items-center justify-between gap-3">
      <div className="flex gap-1 items-center">
        <button
          onClick={() => {
            set_open_sidebar(true);
            select_a_user(null);
          }}
          className="cursor-pointer hover:bg-hover-background text-text p-2 rounded-full duration-300 text-xl md:hidden"
        >
          <IoArrowBack />
        </button>
        <button
          onClick={() => setToggleProfile(true)}
          className=" px-3 py-2 flex items-center gap-4 text-start cursor-pointer hover:bg-hover-background rounded-xl duration-300"
        >
          <ProfileAvatar
            seed={selected_user.full_name}
            name={selected_user.full_name}
            profile_pic={selected_user.profile_pic}
            size="mid"
          />

          <div>
            <p className="font-semibold text-text truncate">
              {selected_user.full_name}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {online_users.includes(selected_user._id) ? "online" : formatLastSeen(selected_user.last_seen).toLowerCase()}
            </p>
          </div>
        </button>
      </div>

      {/* Call */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => {
            console.log("Call");
          }}
          className="cursor-pointer hover:bg-hover-background text-text p-2 rounded-full duration-300 text-2xl"
        >
          <MdOutlineCall />
        </button>

        {/* Search */}
        {/* <button
          onClick={() => {
            console.log("Search");
          }}
          className="cursor-pointer hover:bg-gray-500/15 text-stone-400 p-2 rounded-full duration-300 text-2xl"
        >
          <IoSearchSharp />
        </button> */}

        {/* Display user details */}
        <button
          onClick={() => setToggleProfile(true)}
          className="cursor-pointer hover:bg-hover-background text-text p-2 rounded-full duration-300 text-2xl"
        >
          <HiOutlineDotsVertical />
        </button>

        {toggleProfile &&
          createPortal(
            <PortalBackground openCloseHandler={() => setToggleProfile(false)}>
              <Profile
                isChatPartner={true}
                openCloseHandler={() => setToggleProfile(false)}
              />
            </PortalBackground>,
            document.getElementById("backdrop-root")
          )}
      </div>
    </div>
  );
};

export default SelectedUserBanner;
