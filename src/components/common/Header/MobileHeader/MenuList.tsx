import Link from "next/link";
import { useRouter } from "next/navigation";
import useModalStore from "@/zustand/modalStore";
import Modal from "../../Modal";
import ProfileManagement from "@/components/mypage/profile/ProfileManagement";
import Image from "next/image";
import React, { useState } from "react";
import { useUserStore } from "@/zustand/userStore";
import Cookies from "js-cookie";

interface MenuListProps {
  userId: string | null;
  handleLogout: () => void;
  toggleMenu: () => void;
}

const MenuList: React.FC<MenuListProps> = ({ userId, handleLogout, toggleMenu }) => {
  const { toggleModal } = useModalStore();
  const router = useRouter();
  const { user_nickname, profile_url } = useUserStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleNavigation = (href: string) => async (event: React.MouseEvent) => {
    await router.push(href);
    toggleMenu();
  };

  const handleProtectedNavigation = (href: string) => async (event: React.MouseEvent) => {
    event.preventDefault();

    if (!userId) {
      event.preventDefault();
      router.push("/signin");
    } else if (href === "profile") {
      toggleModal("profile");
    } else {
      await router.push(href);
    }
    toggleMenu();
  };

  const handleModalOrRedirect = async (modalId: string) => {
    if (!userId) {
      await router.push("/signin");
      toggleMenu();
    } else {
      toggleModal(modalId);
    }
  };

  const onLogoutClick = async () => {
    if (!userId) return;

    try {
      toggleMenu();
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        Cookies.remove("accessToken", { path: "/" });

        handleLogout();

        router.push("/");
      }
    } catch (error) {}
  };

  const buttons = [
    { name: "내 정보 관리", onClick: () => handleModalOrRedirect("profile"), src: "/assets/images/edit_profile.svg" },
    { name: "대화 하기", onClick: handleProtectedNavigation("/chat"), src: "/assets/images/chat.svg" },
    { name: "나만의 여행", onClick: handleProtectedNavigation("/travelMbti"), src: "/assets/images/my_travel.svg" },
    { name: "호랑이 모임", onClick: () => router.push("/community"), src: "/assets/images/community.svg" },
  ];

  return (
    <div
      className="absolute top-0 left-0 h-full bg-white shadow-lg flex flex-col p-4 space-y-4 menu-content"
      style={{ width: "321px" }}
    >
      <button className="text-[#FF7C33] self-end text-2xl" onClick={toggleMenu}>
        <span className="text-2xl">&#9776;</span>
      </button>

      <div className="w-full rounded-[20px] border border-primary-100 p-[18px] mb-4 flex items-center">
        <Image src={profile_url || "/assets/images/profile_ex.png"} alt="profile" width={48} height={48} />
        <div className="ml-4 text-start text-secondary-800 font-normal text-[14px] leading-[1.5] tracking-[-0.75px] whitespace-nowrap overflow-hidden text-ellipsis">
          <strong>{user_nickname || "사용자"}</strong>님
          <br /> 행복한 국내 여행하세요
        </div>
      </div>

      <div className="flex justify-center mb-4 padding-[18px]">
        {buttons.map((button, index) => (
          <React.Fragment key={index}>
            <button className="flex flex-col items-center m-[9px]" onClick={button.onClick}>
              <div className="w-[54px] h-[54px]  flex items-center justify-center">
                <Image width={32} height={32} sizes="100%" src={button.src} alt="Icon" />
              </div>
              <p className="text-[12px] text-secondary-800 whitespace-nowrap overflow-hidden text-ellipsis">
                {button.name}
              </p>
            </button>
            {button.name === "내 정보 관리" && userId && (
              <Modal id="profile">
                <ProfileManagement onClick={() => toggleModal("profile")} />
              </Modal>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-black hover:text-grey-400 cursor-pointer block"
        >
          여행지 추천
        </button>
        {dropdownOpen && (
          <div className="absolute left-0 bg-white shadow-lg p-2 rounded-lg flex space-x-4">
            <Link href="/travel">
              <span className="block text-black hover:text-grey-400 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
                추천 여행지
              </span>
            </Link>
            <Link href="/hotel">
              <span className="block text-black hover:text-grey-400 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
                숙소
              </span>
            </Link>
            <Link href="/leports">
              <span className="block text-black hover:text-grey-400 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
                놀거리
              </span>
            </Link>
            <Link href="/restaurant">
              <span className="block text-black hover:text-grey-400 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
                음식점
              </span>
            </Link>
            <Link href="/festival">
              <span className="block text-black hover:text-grey-400 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
                축제 및 행사
              </span>
            </Link>
          </div>
        )}
      </div>

      <Link href="/intro">
        <span className="text-black hover:text-grey-400 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
          호랑 소개
        </span>
      </Link>
      <Link href="/location">
        <span className="text-black hover:text-grey-400 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
          내 근처 여행지
        </span>
      </Link>
      <Link href="/mypage" onClick={(event) => handleProtectedNavigation("/mypage")(event)}>
        <span className="text-black hover:text-grey-400 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
          나의 공간
        </span>
      </Link>

      <div className="space-y-2">
        {userId ? (
          <button onClick={onLogoutClick} className="text-blue-600 hover:text-grey-400 cursor-pointer block">
            로그아웃
          </button>
        ) : (
          <>
            <Link href="/signin" onClick={toggleMenu}>
              <span className="text-black hover:text-grey-400 cursor-pointer block">로그인</span>
            </Link>
            <Link href="/signup" onClick={toggleMenu}>
              <span className="text-black hover:text-grey-400 cursor-pointer block" style={{ marginTop: "8px" }}>
                회원가입
              </span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuList;
