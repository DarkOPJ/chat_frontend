import React from "react";
import background1 from "../../assets/images/chatbg1.png";
import StartChattingPopup from "./StartChattingPopup";
import { MdOutlineCall } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Avatar from "./ProfileAvatar";

const ChatSection = ({ chat }) => {
  return (
    <div
      className="flex-1  bg-contain relative"
      style={{
        backgroundImage: `url(${background1})`,
      }}
    >
      <div className="absolute py-3 px-5 top-0 left-0 right-0 bg-dark_purple z-10 flex items-center justify-between gap-10">
        <div className="flex gap-4 items-center">
          <Avatar seed={chat.id}>{chat.avatar}</Avatar>
          <div>
            <p className="font-semibold text-white truncate">{chat.name}</p>
            <p className="text-sm text-gray-500 truncate">
              last seen 2 minutes ago
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log("Menu");
            }}
            className="cursor-pointer hover:bg-gray-500/15 text-stone-400 p-2 rounded-full duration-300 text-2xl"
          >
            <MdOutlineCall />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log("Menu");
            }}
            className="cursor-pointer hover:bg-gray-500/15 text-stone-400 p-2 rounded-full duration-300 text-2xl"
          >
            <IoSearchSharp />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log("Menu");
            }}
            className="cursor-pointer hover:bg-gray-500/15 text-stone-400 p-2 rounded-full duration-300 text-2xl"
          >
            <HiOutlineDotsVertical />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center h-full bg-[linear-gradient(135deg,rgba(99,102,241,0.1),rgba(10,10,10,0.2),rgba(200,197,94,0.1))]">
        <StartChattingPopup />
      </div>
    </div>
  );
};

export default ChatSection;
