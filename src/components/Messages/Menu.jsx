import React, { useState } from "react";
import { MdOutlineMusicNote, MdOutlineMusicOff } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import useAuthStore from "../../store/AuthStore";
import MenuBtn from "./MenuBtn";
import useApplicationStore from "../../store/ApplicationStore";
import PortalBackground from "../Misc/PortalBackground";
import Profile from "./Profile/Profile";
import { createPortal } from "react-dom";
import ProfileAvatar from "./Profile/ProfileAvatar";
import { toast } from "react-toastify";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

const Menu = ({
  children,
  menuOpen,
  setMenuOpen,
  isMainMenu = true,
  positioningAndSize,
}) => {
  const { authenticated_user, logout } = useAuthStore();
  const { enable_sound, toggle_sound } = useApplicationStore();
  const [toggleProfile, setToggleProfile] = useState(false);

  return (
    <div
      className={`absolute  bg-gray-00 ${
        isMainMenu ? "w-[420px] h-[400px] -top-4 -left-4" : positioningAndSize
      }  z-20 transition-all duration-500 ease-in-out ${
        !menuOpen
          ? "opacity-0 scale-95 pointer-events-none"
          : "opacity-100 scale-100"
      }`}
      onClick={(e) => {
        // Prevent closing when clicking inside the Menu component
        if (e.target === e.currentTarget) setMenuOpen(false);
      }}
      onMouseLeave={() => setMenuOpen(false)}
    >
      <div
        className={`absolute  ${
          isMainMenu ? "top-16 left-5" : "bottom-16 left-16"
        } w-60 rounded-lg shadow p-1 bg-normal_purple`}
      >
        {isMainMenu && (
          <>
            {/* Profile */}
            <MenuBtn
              func={() => {
                setToggleProfile(true);
                setMenuOpen(false);
              }}
            >
              <div className="outline-2 outline-purple-600 outline-offset-1 rounded-full">
                <ProfileAvatar
                  profile_pic={authenticated_user.profile_pic}
                  size={"small"}
                  seed={authenticated_user.full_name}
                  name={authenticated_user.full_name}
                />
              </div>

              <p className="text-sm">{authenticated_user.full_name}</p>
            </MenuBtn>
            {/* Toggle sound */}
            <MenuBtn
              func={() => {
                mouseClickSound.currentTime = 0;
                !enable_sound &&
                  mouseClickSound
                    .play()
                    .catch((error) => toast.error("Failed to play sound."));
                toggle_sound();
                setMenuOpen(false);
              }}
            >
              {enable_sound ? (
                <MdOutlineMusicOff className="text-xl" />
              ) : (
                <MdOutlineMusicNote className="text-xl" />
              )}
              <p className="text-sm">
                {enable_sound ? "Disable" : "Enable"} Sound
              </p>
            </MenuBtn>
            {/* Logout */}
            <MenuBtn func={logout}>
              <FiLogOut className="text-xl text-red-700" />
              <p className="text-sm text-red-700">Logout</p>
            </MenuBtn>

            {/* Portal for Profile */}
            {toggleProfile &&
              createPortal(
                <PortalBackground
                  openCloseHandler={() => setToggleProfile(false)}
                >
                  <Profile openCloseHandler={() => setToggleProfile(false)} />
                </PortalBackground>,
                document.getElementById("backdrop-root")
              )}
          </>
        )}

        {!isMainMenu && <>{children}</>}
      </div>
    </div>
  );
};

export default Menu;
