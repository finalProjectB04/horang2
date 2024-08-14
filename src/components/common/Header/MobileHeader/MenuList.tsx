import Link from "next/link";
import { useRouter } from "next/navigation";
import useModalStore from "@/zustand/modalStore";
import Modal from "../../Modal";
import ProfileManagement from "@/components/mypage/profile/ProfileManagement";
import Image from "next/image";
import React from "react";
import { useUserStore } from "@/zustand/userStore";

interface MenuListProps {
  userId: string | null;
  handleLogout: () => void;
  toggleMenu: () => void;
}

const MenuList: React.FC<MenuListProps> = ({ userId, handleLogout, toggleMenu }) => {
  const { toggleModal } = useModalStore();
  const router = useRouter();
  const { user_nickname, profile_url } = useUserStore();

  const handleNavigation = (href: string) => (event: React.MouseEvent) => {
    if (!userId) {
      event.preventDefault();
      router.push("/signin");
    } else {
      router.push(href);
    }
  };

  const buttons = [
    { name: "내 정보 관리", onClick: () => toggleModal("profile") },
    { name: "대화 하기", onClick: handleNavigation("/chat") },
    { name: "나만의 여행", onClick: handleNavigation("/travelMbti") },
    { name: "호랑이 모임", onClick: () => router.push("/community") },
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

      <div className="flex justify-center mb-4 space-x-[18px]">
        {buttons.map((button, index) => (
          <React.Fragment key={index}>
            <button className="flex flex-col items-center space-y-2" onClick={button.onClick}>
              <div className="border border-primary-700 rounded-xl w-[54px] h-[54px]"></div>
              <p className="text-[12px] text-secondary-800 whitespace-nowrap overflow-hidden text-ellipsis">
                {button.name}
              </p>
            </button>
            {button.name === "내 정보 관리" && (
              <Modal id="profile">
                <ProfileManagement onClick={() => toggleModal("profile")} />
              </Modal>
            )}
          </React.Fragment>
        ))}
      </div>

      <Link href="/travel">
        <span className="text-black hover:text-gray-400 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
          추천 여행지
        </span>
      </Link>
      <Link href="/hotel">
        <span className="text-black hover:text-gray-400 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
          숙소
        </span>
      </Link>
      <Link href="/leports">
        <span className="text-black hover:text-gray-400 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
          레포츠
        </span>
      </Link>
      <Link href="/restaurant">
        <span className="text-black hover:text-gray-400 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
          음식점
        </span>
      </Link>
      <Link href="/festival">
        <span className="text-black hover:text-gray-400 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
          축제 및 행사
        </span>
      </Link>
      <Link href="/location">
        <span className="text-black hover:text-gray-400 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis">
          내 근처 여행지
        </span>
      </Link>
      <Link href="/mypage">
        <span
          className="text-black hover:text-gray-400 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis"
          onClick={handleNavigation("/mypage")}
        >
          나의 공간
        </span>
      </Link>

      <div className="space-y-2">
        {userId ? (
          <button onClick={handleLogout} className="text-blue-600 hover:text-gray-400 cursor-pointer block">
            로그아웃
          </button>
        ) : (
          <>
            <Link href="/signin">
              <span className="text-black hover:text-gray-400 cursor-pointer block">로그인</span>
            </Link>
            <Link href="/signup">
              <span className="text-black hover:text-gray-400 cursor-pointer block" style={{ marginTop: "8px" }}>
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
