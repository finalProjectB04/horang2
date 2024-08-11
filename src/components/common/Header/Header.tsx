"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "@/utils/auth";
import Logo from "./Logo";
import Nav from "./Nav";
import AuthButtons from "./AuthButtons";
import { useUserStore } from "@/zustand/userStore";
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
      await logoutUser();
      clearUser();
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const closeMenuOnClickOutside = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest(".menu-content")) return;
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full left-0 z-50 text-white h-[84px] bg-cover bg-center lg:bg-[url('/assets/images/header/header.png')] lg:bg-secondary-800 bg-[#0932C7]">
      <div className="container mx-auto max-w-[1440px] flex items-center h-full px-4">
        <MobileHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          toggleMenu={toggleMenu}
          isMenuOpen={isMenuOpen}
          closeMenuOnClickOutside={closeMenuOnClickOutside}
          handleLogout={handleLogout}
          userId={userId}
        />
        {/* 로고 및 내비게이션 - PC 버전 */}
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
