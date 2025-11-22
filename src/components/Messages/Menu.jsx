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
import { IoIosColorWand } from "react-icons/io";
import { HiMiniChevronRight } from "react-icons/hi2";
import Light from "../Misc/CustomIcons/Light";
import Midnight from "../Misc/CustomIcons/Midnight";
import Dark from "../Misc/CustomIcons/Dark";
import useMessageStore from "../../store/MessagesStore";

const mouseClickSound = new Audio("/sounds/mouse-click.mp3");

const Menu = ({
  children,
  menuOpen,
  setMenuOpen,
  isMainMenu = true,
  positioningAndSize,
}) => {
  const { authenticated_user, logout } = useAuthStore();
  const { enable_sound, toggle_sound, switch_theme, theme } =
    useApplicationStore();
  const { select_a_user } = useMessageStore();
  const [toggleProfile, setToggleProfile] = useState(false);
  const [toggleThemeMenu, setToggleThemeMenu] = useState(false);

  return (
    <div
      className={`absolute ${
        isMainMenu ? "w-[550px] h-[400px] -top-4 -left-4" : positioningAndSize
      }  z-20 transition-all duration-300 ease-in-out ${
        !menuOpen
          ? "opacity-0 scale-95 pointer-events-none"
          : "opacity-100 scale-100"
      }`}
      onClick={(e) => {
        // Prevent closing when clicking inside the Menu component
        if (e.target === e.currentTarget) setMenuOpen(false);
      }}
      onMouseLeave={() => {
        setMenuOpen(false);
        setToggleThemeMenu(false);
      }}
    >
      <div
        className={`absolute  ${
          isMainMenu ? "top-16 left-5" : "bottom-16 left-16"
        } w-60 rounded-lg shadow-md p-1 bg-background/80 backdrop-blur-lg shadow-full-color/10`}
      >
        {isMainMenu && (
          <>
            {/* Profile */}
            <MenuBtn
              func={() => {
                setToggleProfile(true);
                setMenuOpen(false);
                setToggleThemeMenu(false);
              }}
            >
              <div className="outline-2 outline-full-color outline-offset-1 rounded-full">
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
                setToggleThemeMenu(false);
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

            {/* Theme selection */}
            <MenuBtn
              func={() => {
                setToggleThemeMenu((prev) => !prev);
              }}
            >
              <IoIosColorWand className="text-xl" />
              <div className="flex justify-between items-center w-full">
                <p className="text-sm">Themes</p>
                <HiMiniChevronRight className="text-lg" />
              </div>
            </MenuBtn>
            {/* Lmao calling a react component within itself 🤣🤣🤣 */}
              <Menu
                menuOpen={toggleThemeMenu}
                setMenuOpen={setToggleThemeMenu}
                isMainMenu={false}
                positioningAndSize={"w-60 top-[280px] -right-[178px]"}
              >
                <MenuBtn func={() => switch_theme("light")}>
                  <Light className={"size-5"} />
                  <div className="flex justify-between items-center gap-1 w-full">
                    <p className="text-sm text-text">Light</p>
                    {theme === "light" && (
                      <div className="size-2 rounded-full bg-green-600 animate-pulse" />
                    )}
                  </div>
                </MenuBtn>
                <MenuBtn func={() => switch_theme("midnight")}>
                  <Midnight className={"size-5"} />
                  <div className="flex justify-between items-center gap-1 w-full">
                    <p className="text-sm text-text">Midnight</p>
                    {theme === "midnight" && (
                      <div className="size-2 rounded-full bg-green-600 animate-pulse" />
                    )}
                  </div>
                </MenuBtn>
                <MenuBtn func={() => switch_theme("dark")}>
                  <Dark className={"size-5"} />
                  <div className="flex justify-between items-center gap-1 w-full">
                    <p className="text-sm text-text">Dark</p>
                    {theme === "dark" && (
                      <div className="size-2 rounded-full bg-green-600 animate-pulse" />
                    )}
                  </div>
                </MenuBtn>
              </Menu>

            {/* Logout */}
            <MenuBtn
              func={() => {
                select_a_user(null);
                logout();
              }}
            >
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
