import React from "react";
import { IoSearchSharp } from "react-icons/io5";

const Search = () => {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Search"
        className="peer w-full pl-10 pr-4 py-2 hover:outline-gray-300 outline-2 outline-gray-100 focus:outline-purple-400   rounded-full duration-300"
      />
      <IoSearchSharp
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 peer-focus:text-purple-400 transition-colors duration-300 pointer-events-none"
        size={18}
      />
    </div>
  );
};

export default Search;
