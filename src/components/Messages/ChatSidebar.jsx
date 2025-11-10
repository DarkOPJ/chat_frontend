import React, { useState, useRef, useEffect } from "react";
import ChatUserBtn from "./ChatUserBtn";
import Menu from "./Menu";
import Search from "./Search";
import { HiMenu } from "react-icons/hi";
import SubMenus from "./SubMenus";
import useApplicationStore from "../../store/ApplicationStore";
import useMessageStore from "../../store/MessagesStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";

const COMPACT_WIDTH = 95;
const MIN_WIDTH = 310;
const MAX_WIDTH = 420;
const COLLAPSE_THRESHOLD = 180;

const ChatSidebar = ({ smallScreen }) => {
  const {
    is_loading_contacts,
    is_loading_chat_partners,
    get_all_contacts,
    get_all_chat_partners,
    all_contacts,
    all_chat_partners,
    open_sidebar,
    set_open_sidebar,
  } = useMessageStore();
  const {
    current_submenu,
    sidebar_width,
    change_sidebar_width,
    is_compact,
    change_compact,
    hydrate,
  } = useApplicationStore();
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    set_open_sidebar(false);
  };

  useEffect(() => {
    get_all_chat_partners();
    get_all_contacts();
    hydrate();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const newWidth = e.clientX;

      if (newWidth < COLLAPSE_THRESHOLD) {
        change_sidebar_width(COMPACT_WIDTH);
        change_compact(true);
      } else if (newWidth >= COLLAPSE_THRESHOLD && newWidth < MIN_WIDTH) {
        if (is_compact) {
          change_sidebar_width(MIN_WIDTH);
          change_compact(false);
        } else {
          change_sidebar_width(MIN_WIDTH);
        }
      } else if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        change_sidebar_width(newWidth);
        change_compact(false);
      } else if (newWidth > MAX_WIDTH) {
        change_sidebar_width(MAX_WIDTH);
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
  }, [isResizing, is_compact]);

  return (
    <div
      ref={sidebarRef}
      style={{
        width: smallScreen
          ? open_sidebar
            ? "100%"
            : `${sidebar_width}px`
          : `${sidebar_width}px`,
      }}
      className="shadow-lg flex flex-col transition-none relative bg-dark_purple text-white md:border-r  border-slate-800 duration-300"
    >
      {/* Header */}
      <div
        className={`px-4 pt-4 ${
          is_compact && "pb-4"
        } border-b border-slate-800 flex items-center justify-between `}
      >
        {!smallScreen &&
          (is_compact == false ? (
            <div className=" w-full space-y-3 ">
              <div className="flex items-center gap-2 ">
                <div className="relative">
                  <button
                    onClick={() => {
                      setMenuOpen((prev) => !prev);
                    }}
                    className="cursor-pointer hover:bg-gray-500/15 text-stone-300 p-2 rounded-full duration-300 text-xl"
                  >
                    <HiMenu />
                  </button>

                  <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} isMainMenu={true} />
                </div>
                <Search />
              </div>

              <SubMenus />
            </div>
          ) : (
            <div className="flex justify-center w-full text-2xl">
              <div className="relative">
                <button
                  onClick={() => {
                    setMenuOpen((prev) => !prev);
                  }}
                  className="cursor-pointer hover:bg-gray-500/15 text-stone-300 p-2 rounded-full duration-300 text-xl"
                >
                  <HiMenu />
                </button>

                <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} isMainMenu={true}/>
              </div>
            </div>
          ))}
        {smallScreen && (
          <div className=" w-full space-y-3 ">
            <div className="flex items-center gap-2 ">
              <div className="relative">
                <button
                  onClick={() => {
                    setMenuOpen((prev) => !prev);
                  }}
                  className="cursor-pointer hover:bg-gray-500/15 text-stone-300 p-2 rounded-full duration-300 text-xl"
                >
                  <HiMenu />
                </button>

                <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
              </div>
              <Search />
            </div>

            <SubMenus />
          </div>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-hidden relative">
        {/* All Chats */}
        <div
          className={`absolute top-0 left-0 w-full h-full p-2 transition-transform duration-300 ease-in-out overflow-y-auto hide-scrollbar
      ${current_submenu === "All Chats" ? "translate-x-0" : "-translate-x-full"}
    `}
        >
          {is_loading_chat_partners && <UsersLoadingSkeleton />}
          {all_chat_partners &&
            all_chat_partners.map((chat) => (
              <ChatUserBtn key={chat._id} chat={chat} />
            ))}
        </div>

        {/* Contacts */}
        <div
          className={`absolute top-0 left-0 w-full h-full p-2 transition-transform duration-300 ease-in-out overflow-y-scroll hide-scrollbar
      ${current_submenu === "Contacts" ? "translate-x-0" : "translate-x-full"}
    `}
        >
          {is_loading_contacts && <UsersLoadingSkeleton />}

          {all_contacts &&
            all_contacts.map((contact) => (
              <ChatUserBtn key={contact._id} contact={contact} />
            ))}
        </div>
      </div>

      {/* Resize Handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute top-0 -right-0.5 w-1 h-full cursor-ew-resize hover:bg-purple-800 bg-transparent duration-300 md:block hidden"
      />
    </div>
  );
};

export default ChatSidebar;
