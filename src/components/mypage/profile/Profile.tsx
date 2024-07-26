"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import Button from "../../common/button";
import useModalStore from "@/zustand/ModalStore";
import Modal from "../../common/Modal";
import ProfileManagement from "./ProfileManagement";
import { useUserStore } from "@/zustand/userStore";
import { useRouter } from "next/navigation";
import ProfileCarousel from "./ProfileCarousel";

const Profile: React.FC = () => {
  const { toggleModal } = useModalStore();
  const { user_nickname, profile_url, setUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {}, [setUser]);

  const buttons = [
    { name: "내 정보 관리", onClick: () => toggleModal("profile") },
    { name: "대화 하기", onClick: () => console.log("대화 하기 버튼 클릭") },
    { name: "나만의 여행", onClick: () => console.log("나만의 여행 버튼 클릭") },
    { name: "호랑이 모임", onClick: () => console.log("호랑이 모임 버튼 클릭") },
  ];

  return (
    <section className="border-b-2 flex justify-between items-center p-5 mb-5">
      <div className="mr-8">
        <Image src={profile_url ?? "/assets/images/profile_ex.png"} alt="profile" width={200} height={200} />
      </div>
      <div className="w-1/3 mr-8">
        <p className="mb-5 text-start font-semibold text-xl">
          <strong>{user_nickname}</strong>님 행복한 국내 여행하세요
        </p>
        <div className="grid grid-cols-2 gap-4">
          {buttons.map((button, index) => (
            <React.Fragment key={index}>
              <Button hover={true} buttonName={button.name} onClick={button.onClick} />
              {button.name === "내 정보 관리" && (
                <Modal id="profile">
                  <ProfileManagement onClick={() => toggleModal("profile")} />
                </Modal>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="relative cursor-pointer" onClick={() => router.push("location")}>
        <div className="w-[600px] h-[200px] relative">
          <ProfileCarousel />
          <div className="absolute top-1 left-4 p-5 text-white font-extrabold text-3xl pt-10 z-10 text-stroke-1 text-stroke-gray-900">
            <p className="text-start mb-5">이런 여행지는 어떠신가요</p>
            <p className="">
              주변 여행지 구경하러 가기 <span>&gt;</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
