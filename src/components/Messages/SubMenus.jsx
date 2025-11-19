import React from "react";
import Badge from "./Badge";
import useApplicationStore from "../../store/ApplicationStore";
import useMessageStore from "../../store/MessagesStore";

const SubMenus = () => {
  const { all_contacts, all_chat_partners } = useMessageStore();
  const { current_submenu, switch_submenu } = useApplicationStore();
  return (
    <div className="flex overflow-x-hidden min-w-fit">
      <button
        onClick={() => {
          switch_submenu("All Chats");
        }}
        className={`${
          current_submenu === "All Chats"
            ? "text-full-color hover:bg-full-color/15"
            : "text-gray-600 hover:bg-gray-500/15"
        } flex items-center gap-1.5 text-sm cursor-pointer  p-3 rounded-t-xl truncate font-medium`}
      >
        All Chats <Badge text={all_chat_partners.length} />
      </button>
      <button
        onClick={() => {
          switch_submenu("Contacts");
        }}
        className={`${
          current_submenu === "Contacts"
            ? "text-full-color hover:bg-full-color/15"
            : "text-gray-600 hover:bg-gray-500/15"
        } flex items-center gap-1.5 text-sm cursor-pointer  p-3 rounded-t-xl truncate font-medium`}
      >
        Contacts <Badge text={all_contacts.length} />
      </button>
    </div>
  );
};

export default SubMenus;
