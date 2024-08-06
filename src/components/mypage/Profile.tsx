"use client";

import Image from "next/image";
import React, { useEffect, useReducer } from "react";
import Button from "../common/button";
import useModalStore from "@/zustand/modalStore";
import Modal from "../common/Modal";
import ProfileManagement from "./ProfileManagement";
import { useUserStore } from "@/zustand/userStore";
import { useRouter } from "next/navigation";
import ProfileCarousel from "./ProfileCarousel";

const Profile: React.FC = () => {
  const { toggleModal } = useModalStore();
  const { user_nickname, profile_url, setUser } = useUserStore();

  const router = useRouter();

  const hadleGoProfile = () => {
    console.log("동작");
    toggleModal("profile");
  };
  const hadleGoChat = () => {
    console.log("동작");
  };
  const hadleGoMyCourse = () => {
    console.log("동작");
  };

  const handleGoMap = () => {
    router.push("hot-places");
  };

  useEffect(() => {}, [setUser]);

  return (
    <section className="border-b-2 flex justify-center items-center p-5 mb-5">
      <div className="mr-8">
        <Image src={profile_url ?? "/assets/images/ex1.png"} alt="profile" width={200} height={200} />
      </div>
      <div className="mr-8">
        <p className="mb-5 text-start font-semibold text-2xl">{user_nickname}님 안녕하세요</p>
        <div className="grid grid-cols-2 gap-4">
          <Button hover={true} buttonName="회원정보 관리" onClick={hadleGoProfile} />
          <Button hover={true} buttonName="채팅" onClick={hadleGoChat} />
          <Button hover={true} buttonName="회원정보 관리" onClick={hadleGoProfile} />
          <Modal id="profile">
            <ProfileManagement onClick={() => toggleModal("profile")} />
          </Modal>
          <Button hover={true} buttonName="내 취향 코스 짜기" onClick={hadleGoMyCourse} />
        </div>
      </div>
      <div className="relative cursor-pointer" onClick={handleGoMap}>
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
