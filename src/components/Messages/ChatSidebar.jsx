import React, { useState, useRef, useEffect } from "react";
import ChatUserBtn from "./ChatUserBtn";
import SoundLogoutBtns from "./SoundLogoutBtns";
import Search from "./Search";
import { HiMenu } from "react-icons/hi";

const COMPACT_WIDTH = 95;
const MIN_WIDTH = 240;
const MAX_WIDTH = 400;
const COLLAPSE_THRESHOLD = 180;

const ChatSidebar = ({ chats = [] }) => {
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const sidebarRef = useRef(null);

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
      className=" shadow-lg flex flex-col relative transition-none bg-dark_purple text-white"
    >
      {/* Header */}
      <div className="p-4 border-r border-b border-zinc-800 flex items-center justify-between">
        {!isCompact ? (
          <div className="flex items-center gap-2 w-full justify-between">
            {/* Search */}
            <div className="flex items-center gap-2 w-full">
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

            <SoundLogoutBtns />
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
      <div className="flex-1 overflow-y-auto p-2 ">
        {chats.map((chat) => (
          <ChatUserBtn chat={chat} isCompact={isCompact} />
        ))}
      </div>

      {/* Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-0 -right-0.5 w-1 h-full cursor-ew-resize hover:bg-purple-800 bg-transparent duration-300"
      />
    </div>
  );
};

export default ChatSidebar;
