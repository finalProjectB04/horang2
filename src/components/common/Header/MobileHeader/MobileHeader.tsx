"use client";

import { useState } from "react";
import Image from "next/image";
import SearchInput from "./SearchInput";
import MenuList from "./MenuList";

interface MobileHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  toggleMenu: () => void;
  isMenuOpen: boolean;
  closeMenuOnClickOutside: (event: React.MouseEvent) => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  toggleMenu,
  isMenuOpen,
  closeMenuOnClickOutside,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  return (
    <div className="md:hidden flex justify-between w-full h-[60px]">
      <button className="text-[#ffffff] focus:outline-none" onClick={toggleMenu}>
        <span className="text-2xl">&#9776;</span>
      </button>
      <div className="relative flex items-center">
        <button className="text-[#FF7C33] focus:outline-none" onClick={toggleSearch}>
          <Image src="/assets/images/header/search.png" alt="Search" width={24} height={24} />
        </button>
        <SearchInput
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isSearchOpen={isSearchOpen}
          closeSearchOnClickOutside={(event: MouseEvent) => setIsSearchOpen(false)}
        />
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50" onClick={closeMenuOnClickOutside}>
          <MenuList toggleMenu={toggleMenu} userId={"someUserId"} handleLogout={() => {}} />
        </div>
      )}
    </div>
  );
};

export default MobileHeader;
