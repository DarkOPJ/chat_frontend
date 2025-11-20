import React from "react";
import { IoSearchSharp } from "react-icons/io5";
import useMessageStore from "../../store/MessagesStore";

const Search = () => {
  const { search_query, set_search_query } = useMessageStore();

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search"
        value={search_query}
        onChange={(e) => set_search_query(e.target.value)}
        className="peer w-full pl-10 pr-4 py-2 hover:ring-text/30 outline-none ring-text/10 focus:ring-full-color focus:ring-2 ring rounded-full duration-300 text-sm"
      />
      <IoSearchSharp
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text peer-focus:text-full-color transition-colors duration-300 pointer-events-none"
        size={18}
      />
    </div>
  );
};

export default Search;
