import React from "react";
import Badge from "./Badge";
import useMessageStore from "../../store/MessageStore";

const SubMenus = () => {
  const { chats, contacts, current_submenu, switch_submenu } =
    useMessageStore();
  return (
    <div className="flex overflow-x-hidden min-w-fit">
      <button
        onClick={() => {
          switch_submenu("All Chats");
        }}
        className={`${
          current_submenu === "All Chats"
            ? "text-purple-500 hover:bg-purple-500/15"
            : "text-gray-500 hover:bg-gray-500/15"
        } flex items-center gap-1.5 text-sm cursor-pointer  p-3 rounded-t-xl truncate font-medium`}
      >
        All Chats <Badge text={chats.length} />
      </button>
      <button
        onClick={() => {
          switch_submenu("Contacts");
        }}
        className={`${
          current_submenu === "Contacts"
            ? "text-purple-500 hover:bg-purple-500/15"
            : "text-gray-500 hover:bg-gray-500/15"
        } flex items-center gap-1.5 text-sm cursor-pointer  p-3 rounded-t-xl truncate font-medium`}
      >
        Contacts <Badge text={contacts.length} />
      </button>
    </div>
  );
};

export default SubMenus;
