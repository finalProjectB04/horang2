"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Button from "../../common/button";
import Modal from "../../common/Modal";
import ProfileManagement from "./ProfileManagement";
import { useUserStore } from "@/zustand/userStore";
import { useRouter } from "next/navigation";
import ProfileCarousel from "./ProfileCarousel";
import LoadingPage from "@/app/loading";
import useModalStore from "@/zustand/modalStore";

const Profile: React.FC = () => {
  const { toggleModal } = useModalStore();
  const { user_nickname, profile_url, setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (user_nickname !== null && profile_url !== null) {
      setIsLoading(false);
    }
  }, [user_nickname, profile_url]);

  if (isLoading) {
    return <LoadingPage />;
  }

  const buttons = [
    { name: "내 정보 관리", onClick: () => toggleModal("profile") },
    { name: "대화 하기", onClick: () => router.push("/chat") },
    { name: "나만의 여행", onClick: () => router.push("/travelMbti") },
    { name: "호랑이 모임", onClick: () => router.push("/community") },
  ];

  return (
    <section className="md:border-b-2 lg:border-b-2 sm:flex-col flex items-center sm:justify-center md:justify-between lg:justify-between sm:mt-[20px] md:mt-[60px] md:pb-16 md:mb-16 lg:mt-[60px] lg:pb-16 lg:mb-16">
      <button
        className="sm:block md:hidden lg:hidden w-fit flex items-center justify-start pl-6 my-3"
        onClick={() => router.back()}
      >
        <Image src="/assets/images/back.png" width={10} height={17} alt="뒤로가기" />
      </button>
      <div className="px-6 py-5">
        <div className="sm:flex md:hidden lg:hidden w-full rounded-[20px] border border-primary-100 p-[18px]">
          <Image
            src={profile_url || "/assets/images/profile_ex.png"}
            alt="profile"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div className="ml-4 text-start text-secondary-800 font-normal text-[14px] leading-[1.5] tracking[-0.75px]">
            <strong>{user_nickname}</strong>님
            <br /> 행복한 국내 여행하세요
          </div>
        </div>
      </div>
      <div className="sm:hidden md:block lg:block mr-8">
        <Image
          src={profile_url || "/assets/images/profile_ex.png"}
          alt="profile"
          width={200}
          height={200}
          className="rounded-full"
        />
      </div>
      <div className="sm:block md:hidden lg:hidden w-full my-5">
        <div className="flex justify-center">
          {buttons.map((button, index) => (
            <button key={index} onClick={button.onClick}>
              <div className="border border-primary-700 rounded-xl w-[54px] h-[54px] m-[9px]"></div>
              <p className="text-[12px] text-secondary-800">{button.name}</p>
              {button.name === "내 정보 관리" && (
                <Modal id="profile">
                  <ProfileManagement onClick={() => toggleModal("profile")} />
                </Modal>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="sm:hidden md:block lg:block w-[420px] mr-8">
        <div className="mb-6 text-start text-secondary-800 font-normal text-[24px] leading-[1.5] tracking[-0.75px]">
          <strong>{user_nickname}</strong>님 행복한 국내 여행하세요
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
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
      <div
        className="sm:block md:hidden lg:hidden relative cursor-pointer my-5"
        onClick={() => router.push("location")}
      >
        <div className="w-full h-[100px] relative">
          <ProfileCarousel />
          <div className="absolute top-0 left-4 p-5 text-white font-extrabold text-lg pt-5 z-10 text-stroke-1 text-stroke-gray-900">
            <p className="text-start mb-1">이런 여행지는 어떠신가요</p>
            <p className="">
              주변 여행지 구경하러 가기 <span>&gt;</span>
            </p>
          </div>
        </div>
      </div>
      <div className="sm:hidden md:block lg:block relative cursor-pointer" onClick={() => router.push("location")}>
        <div className="w-[700px] h-[200px] relative">
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
