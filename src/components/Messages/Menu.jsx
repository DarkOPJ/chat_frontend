import React from "react";
import { MdOutlineMusicNote, MdOutlineMusicOff } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import useAuthStore from "../../store/AuthStore";
import MenuBtn from "./MenuBtn";
import useMessageStore from "../../store/MessageStore";

const Menu = ({ menuOpen, setMenuOpen }) => {
  const { logout } = useAuthStore();
  const { enable_sound, toggle_sound } = useMessageStore();
  return (
    <div
      className={`absolute w-[420px] h-[400px] bg-transparent -top-4 -left-4  z-20 transition-all duration-500 ease-in-out ${
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
      <div className="absolute top-16 left-5 w-60 rounded-lg shadow p-1 bg-normal_purple ">
        <MenuBtn
          func={() => {
            toggle_sound();
            setMenuOpen(false);
          }}
        >
          {enable_sound ? (
            <MdOutlineMusicOff className="text-lg" />
          ) : (
            <MdOutlineMusicNote className="text-lg" />
          )}
          <p className="text-sm">{enable_sound ? "Disable" : "Enable"} Sound</p>
        </MenuBtn>

        <MenuBtn func={logout}>
          <FiLogOut className="text-lg text-red-700" />
          <p className="text-sm text-red-700">Logout</p>
        </MenuBtn>
      </div>
    </div>
  );
};

export default Menu;
