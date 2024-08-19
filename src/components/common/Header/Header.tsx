"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/zustand/userStore";
import Logo from "./Logo";
import Nav from "./Nav";
import AuthButtons from "./AuthButtons";
import MobileHeader from "./MobileHeader/MobileHeader";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id: userId, clearUser } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      clearUser();
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/");
    } catch (error) {}
  };

  const closeMenuOnClickOutside = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest(".menu-content")) return;
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full left-0 z-50 text-white h-[84px] lg:bg-cover lg:bg-center lg:bg-[url('/assets/images/header/header.png')] lg:bg-secondary-800 bg-secondary-800">
      <div className="container mx-auto max-w-[1440px] flex items-center h-full px-4 bg-cover bg-center bg-[url('/assets/images/header/header.png')] lg:bg-none">
        <MobileHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          toggleMenu={toggleMenu}
          isMenuOpen={isMenuOpen}
          closeMenuOnClickOutside={closeMenuOnClickOutside}
          handleLogout={handleLogout}
          userId={userId}
        />
        <div className="hidden lg:flex items-center w-full">
          <Logo />
          <Nav />
          <AuthButtons userId={userId} handleLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
};

export default Header;
