"use client";

import { useState } from "react";
import Image from "next/image";
import SearchInput from "./SearchInput";
import MenuList from "./MenuList";
import HamburgerButton from "./HamburgerButton";

interface MobileHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  toggleMenu: () => void;
  isMenuOpen: boolean;
  closeMenuOnClickOutside: (event: React.MouseEvent) => void;
  handleLogout: () => void;
  userId: string | null;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  toggleMenu,
  isMenuOpen,
  closeMenuOnClickOutside,
  handleLogout,
  userId,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  return (
    <div className="flex justify-between w-full h-[60px] lg:hidden">
      <HamburgerButton toggleMenu={toggleMenu} />
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
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 lg:hidden" onClick={closeMenuOnClickOutside}>
          <MenuList toggleMenu={toggleMenu} userId={userId} handleLogout={handleLogout} />
        </div>
      )}
    </div>
  );
};

export default MobileHeader;
