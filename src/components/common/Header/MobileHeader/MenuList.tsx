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

  const buttons = [
    { name: "내 정보 관리", onClick: () => toggleModal("profile") },
    { name: "대화 하기", onClick: () => router.push("/chat") },
    { name: "나만의 여행", onClick: () => router.push("/travelMbti") },
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
        <div className="ml-4 text-start text-secondary-800 font-normal text-[14px] leading-[1.5] tracking-[-0.75px]">
          <strong>{user_nickname || "사용자"}</strong>님
          <br /> 행복한 국내 여행하세요
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-[9px] gap-y-[4px] mb-4">
        {buttons.map((button, index) => (
          <React.Fragment key={index}>
            <button
              className="w-[130px] h-[36px] rounded-[6.311px] border-[0.631px] border-solid border-primary-100 bg-white flex items-center justify-center cursor-pointer"
              onClick={button.onClick}
            >
              <Image
                src="/assets/images/header/Place.png"
                alt={`${button.name} icon`}
                width={19.2}
                height={19.2}
                className="mr-0"
              />
              <span
                className="text-[12px] text-primary-600 font-normal leading-[19.015px] tracking-[-0.3px]"
                style={{
                  fontFeatureSettings: "'calt' off",
                  fontFamily: "Pretendard, sans-serif",
                }}
              >
                {button.name}
              </span>
            </button>
            {button.name === "내 정보 관리" && (
              <Modal id="profile">
                <ProfileManagement onClick={() => toggleModal("profile")} />
              </Modal>
            )}
          </React.Fragment>
        ))}
      </div>

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
