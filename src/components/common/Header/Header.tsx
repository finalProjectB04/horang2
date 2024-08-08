"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "@/utils/auth";
import Logo from "./Logo";
import Nav from "./Nav";
import AuthButtons from "./AuthButtons";
import { useUserStore } from "@/zustand/userStore";
import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id: userId, clearUser } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
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

  // 메뉴 외부를 클릭하면 메뉴를 닫음
  const closeMenuOnClickOutside = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest(".menu-content")) return;
    setIsMenuOpen(false);
  };

  // 검색창 외부를 클릭하면 검색창을 닫음
  const closeSearchOnClickOutside = (event: MouseEvent) => {
    if (event.target && (event.target as HTMLElement).closest(".search-content")) return;
    setIsSearchOpen(false);
  };

  useEffect(() => {
    if (isSearchOpen) {
      document.addEventListener("click", closeSearchOnClickOutside);
    } else {
      document.removeEventListener("click", closeSearchOnClickOutside);
    }
    return () => {
      document.removeEventListener("click", closeSearchOnClickOutside);
    };
  }, [isSearchOpen]);

  return (
    <header className="fixed top-0 w-full left-0 z-50 text-white h-[84px] bg-cover bg-center md:bg-[url('/assets/images/header/header.png')] md:bg-secondary-800 bg-[#0932C7]">
      <div className="container mx-auto max-w-[1440px] flex items-center h-full px-4">
        {/* 모바일 햄버거 메뉴 및 검색 */}
        <div className="md:hidden flex justify-between w-full h-[60px]">
          <button className="text-[#ffffff] focus:outline-none" onClick={toggleMenu}>
            <span className="text-2xl">&#9776;</span>
          </button>
          <div className="relative flex items-center">
            <button className="text-[#FF7C33] focus:outline-none" onClick={toggleSearch}>
              <Image src="/assets/images/header/search.png" alt="Search" width={24} height={24} />
            </button>
            {isSearchOpen && (
              <div className="absolute top-1/2 transform -translate-y-1/2 right-[32px] bg-transparent flex items-center search-content">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="bg-[#062799] border border-gray-300 rounded-lg px-4 py-2 text-white w-64"
                  placeholder="Search..."
                  autoFocus
                />
              </div>
            )}
          </div>
        </div>

        {/* 로고 및 내비게이션 - PC 버전 */}
        <div className="hidden md:flex items-center w-full">
          <Logo />
          <Nav />
          <AuthButtons userId={userId} handleLogout={handleLogout} />
        </div>

        {/* 모바일 슬라이드 메뉴 */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50" onClick={closeMenuOnClickOutside}>
            <div
              className="absolute top-0 left-0 h-full bg-white shadow-lg flex flex-col p-4 space-y-4 menu-content"
              style={{ width: "321px" }}
            >
              <button className="text-[#FF7C33] self-end text-2xl" onClick={toggleMenu}>
                <span className="text-2xl">&#9776;</span>
              </button>

              <Link href="/intro">
                <span className="text-black hover:text-gray-400 cursor-pointer">호랑 소개</span>
              </Link>
              <Link href="/travel">
                <span className="text-black hover:text-gray-400 cursor-pointer">추천 여행지</span>
              </Link>
              <Link href="/hotel">
                <span className="text-black hover:text-gray-400 cursor-pointer">숙소</span>
              </Link>
              <Link href="/leports">
                <span className="text-black hover:text-gray-400 cursor-pointer">레포츠</span>
              </Link>
              <Link href="/restaurant">
                <span className="text-black hover:text-gray-400 cursor-pointer">음식점</span>
              </Link>
              <Link href="/festival">
                <span className="text-black hover:text-gray-400 cursor-pointer">축제 및 행사</span>
              </Link>
              <Link href="/location">
                <span className="text-black hover:text-gray-400 cursor-pointer">내 근처 여행지</span>
              </Link>
              <Link href="/travelMbti">
                <span className="text-black hover:text-gray-400 cursor-pointer">나만의 여행</span>
              </Link>
              <Link href="/mypage">
                <span className="text-black hover:text-gray-400 cursor-pointer">나의 공간</span>
              </Link>
              <Link href="/community">
                <span className="text-black hover:text-gray-400 cursor-pointer">호랑이 모임</span>
              </Link>

              <div className="space-y-2">
                {userId ? (
                  <button onClick={handleLogout} className="text-black hover:text-gray-400 cursor-pointer block">
                    로그아웃
                  </button>
                ) : (
                  <>
                    <Link href="/signin">
                      <span className="text-black hover:text-gray-400 cursor-pointer block">로그인</span>
                    </Link>
                    <Link href="/signup">
                      <span
                        className="text-black hover:text-gray-400 cursor-pointer block"
                        style={{ marginTop: "8px" }}
                      >
                        회원가입
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
