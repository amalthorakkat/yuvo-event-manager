


import React, { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import YEMlogo from "../../assets/YEMlogo.svg";
import YEMtext from "../../assets/YEMtext.svg";

const AudHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50); // Trigger effect after 50px scroll
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50
        flex items-center justify-center py-3 px-4 gap-5
        transition-all duration-300 ease-in-out
        ${isScrolled 
          ? 'backdrop-blur-md bg-white/20  shadow-lg shadow-black/5 ' 
          : 'bg-transparent'
        }
      `}
    >
      {/* Logo */}
      <div>
        <h1 className="font-bold text-black">YUVO</h1>
      </div>

      {/* Search Bar */}
      <div className={`
        flex items-center border-2 w-[220px] h-[35px] rounded-[30px] px-2
        transition-all duration-300 ease-in-out
        ${isScrolled 
          ? 'border-white/30 bg-white/30 backdrop-blur-sm' 
          : 'border-[#DFE1DF] bg-white'
        }
      `}>
        <div className="pr-2">
          <IoSearchOutline className="text-2xl text-[#bdbdbd]" />
        </div>
        <input
          className={`
            w-full h-full outline-none
            transition-all duration-300 ease-in-out
            ${isScrolled 
              ? 'bg-transparent placeholder-gray-600' 
              : 'bg-transparent placeholder-[#bdbdbd]'
            }
          `}
          type="text"
          placeholder="Search"
        />
      </div>

      {/* Button */}
      <div>
        <button className={`
          cursor-pointer relative group overflow-hidden text-white w-[80px] h-[35px] px-2 
          flex items-center justify-center rounded-full border shadow-lg 
          transition-all duration-300 hover:scale-105 active:scale-95
          ${isScrolled 
            ? 'bg-black/80 backdrop-blur-sm border-white/20 hover:shadow-gray-700/30' 
            : 'bg-black border-white/10 hover:shadow-gray-700/50'
          }
        `}>
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