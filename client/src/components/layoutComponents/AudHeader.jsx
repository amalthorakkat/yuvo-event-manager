import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import YEMlogo from "../../assets/YEMlogo.svg";
import YEMtext from "../../assets/YEMtext.svg";

const AudHeader = () => {
  return (
    <header className="flex items-center justify-center py-3 px-4 gap-5">
      {/* Logo */}
      <div>
        <h1 className="font-bold">YUVO</h1>
      </div>

      {/* Search Bar */}
      <div className="flex items-center border-2 border-[#DFE1DF] w-[220px] h-[35px] rounded-[30px] px-2">
        <div className="pr-2">
          <IoSearchOutline className="text-2xl text-[#bdbdbd]" />
        </div>
        <input
          className="w-full h-full outline-none"
          type="text"
          placeholder="Search"
        />
      </div>

      {/*Button*/}
      <div>
        <button className="cursor-pointer relative group overflow-hidden bg-black text-white w-[80px] h-[35px] px-2 flex items-center justify-center rounded-full border border-white/10 shadow-lg hover:shadow-gray-700/50 transition-all duration-300 hover:scale-105 active:scale-95 ">
          <div className="absolute inset-0 flex items-center w-full transition-transform duration-300 ease-in-out group-hover:-translate-x-full">
            {/* Initial logo */}
            <img
              src={YEMlogo}
              alt="YEM Logo"
              className="h-4 w-full flex-shrink-0"
            />
            {/* Hover Text */}
            <img
              src={YEMtext}
              alt="YEM Text"
              className="h-[9px] w-[100%] flex-shrink-0"
            />
          </div>
        </button>
      </div>
    </header>
  );
};

export default AudHeader;
