import React, { useState, useRef, useEffect } from "react";
import ChatUserBtn from "./ChatUserBtn";
import SoundLogoutBtns from "./SoundLogoutBtns";
import Search from "./Search";
import { HiMenu } from "react-icons/hi";
import SubMenus from "./SubMenus";
import useMessageStore from "../../store/MessageStore";

const COMPACT_WIDTH = 95;
const MIN_WIDTH = 310;
const MAX_WIDTH = 420;
const COLLAPSE_THRESHOLD = 180;

const ChatSidebar = () => {
  const { chats, contacts, current_submenu } = useMessageStore();
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const sidebarRef = useRef(null);
  // const [subMenu, setSubMenu] = useState(current_submenu)

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const newWidth = e.clientX;

      if (newWidth < COLLAPSE_THRESHOLD) {
        setSidebarWidth(COMPACT_WIDTH);
        setIsCompact(true);
      } else if (newWidth >= COLLAPSE_THRESHOLD && newWidth < MIN_WIDTH) {
        if (isCompact) {
          setSidebarWidth(MIN_WIDTH);
          setIsCompact(false);
        } else {
          setSidebarWidth(MIN_WIDTH);
        }
      } else if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
        setIsCompact(false);
      } else if (newWidth > MAX_WIDTH) {
        setSidebarWidth(MAX_WIDTH);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, isCompact]);

  return (
    <div
      ref={sidebarRef}
      style={{ width: `${sidebarWidth}px` }}
      className=" shadow-lg flex flex-col relative transition-none bg-dark_purple text-white border-r  border-slate-800"
    >
      {/* Header */}
      <div
        className={`px-4 pt-4 ${
          isCompact && "pb-4"
        } border-b border-slate-800 flex items-center justify-between `}
      >
        {!isCompact ? (
          <div className=" w-full space-y-3 ">
            <div className="flex items-center gap-2 ">
              {/* Search */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Menu");
                }}
                className="cursor-pointer hover:bg-gray-500/15 text-stone-300 p-2 rounded-full duration-300 text-xl"
              >
                <HiMenu />
              </button>
              {!isCompact && <Search />}
            </div>

            {/* <SoundLogoutBtns /> */}

            <SubMenus />
          </div>
        ) : (
          <div className="flex justify-center w-full text-2xl">
            <button
              onClick={(e) => {
                e.preventDefault();
                console.log("Menu");
              }}
              className="cursor-pointer hover:bg-gray-500/20 p-2 rounded-full duration-300"
            >
              <HiMenu />
            </button>
          </div>
        )}
      </div>

      {/* Chat List */}
      {current_submenu === "All Chats" ? (
        <div>
          <div className="flex-1 overflow-y-auto p-2 ">
            {chats.map((chat) => (
              <ChatUserBtn key={chat.id} chat={chat} isCompact={isCompact} />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex-1 overflow-y-auto p-2 ">
            {contacts.map((contact) => (
              <ChatUserBtn key={contact.id} contact={contact} isCompact={isCompact} />
            ))}
          </div>
        </div>
      )}

      {/* Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-0 -right-0.5 w-1 h-full cursor-ew-resize hover:bg-purple-800 bg-transparent duration-300"
      />
    </div>
  );
};

export default ChatSidebar;
