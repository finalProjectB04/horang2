"use client";

import LoadingPage from "@/app/loading";
import useModalStore from "@/zustand/modalStore";
import { useUserStore } from "@/zustand/userStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Button from "../../common/button";
import Modal from "../../common/Modal";
import ProfileCarousel from "./ProfileCarousel";
import ProfileManagement from "./ProfileManagement";

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
    { name: "내 정보 관리", onClick: () => toggleModal("profile"), src: "/assets/images/edit_profile.svg" },
    // { name: "대화 하기", onClick: () => router.push("/chat"), src: "/assets/images/chat.svg" },
    // { name: "나만의 여행", onClick: () => router.push("/travelMbti"), src: "/assets/images/my_travel.svg" },
    // { name: "호랑이 모임", onClick: () => router.push("/community"), src: "/assets/images/community.svg" },
  ];

  return (
    <section>
      <div className="sm:block md:hidden lg:hidden">
        <button className="w-fit flex items-center justify-start mt-4 mb-9" onClick={() => router.back()}>
          <Image src="/assets/images/back.png" width={10} height={17} alt="뒤로가기" />
        </button>
        <div className="sm:flex md:hidden lg:hidden w-full items-center rounded-[20px] border border-primary-100 p-[18px]">
          <Image
            src={profile_url || "/assets/images/profile_ex.png"}
            alt="profile"
            width={48}
            height={48}
            className="object-cover h-12 rounded-full"
          />
          <div className="ml-4 text-start text-secondary-800 font-normal text-[14px] leading-[1.5] tracking[-0.75px]">
            <p className="text-lg">
              <strong>{user_nickname}</strong>님
            </p>
            <p className="text-lg">행복한 국내 여행하세요</p>
          </div>
        </div>
        {/* 모바일 헤더에 들어가서 임시 제외 */}
        {/* <div className="w-full my-10">
          <div className="flex justify-center">
            {buttons.map((button, index) => (
              <button key={index} onClick={button.onClick}>
                <div className="w-[54px] h-[54px] mx-[18px] p-[8px] flex items-center justify-center">
                  <Image width={32} height={32} sizes="100%" src={button.src} alt="Icon" />
                </div>
                <p className="text-[12px] text-secondary-800">{button.name}</p>
              </button>
            ))}
          </div>
        </div> */}
        <div className="relative cursor-pointer my-5" onClick={() => router.push("location")}>
          <div className="w-full h-[100px] relative">
            <ProfileCarousel />
            <div className="absolute top-0 left-4 p-5 text-white font-extrabold text-lg pt-5 z-10 text-stroke-1 text-stroke-grey-900">
              <p className="text-start mb-1">이런 여행지는 어떠신가요</p>
              <p className="">
                주변 여행지 구경하러 가기 <span>&gt;</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="sm:hidden md:flex lg:flex items-center md:border-b-2 lg:border-b-2 sm:flex-col flex sm:justify-center md:justify-between lg:justify-between sm:mt-[20px] md:mt-[60px] md:pb-10 md:mb-10 lg:mt-[60px] lg:pb-10 lg:mb-10">
        <div className="mr-8">
          <Image
            src={profile_url || "/assets/images/profile_ex.png"}
            alt="profile"
            width={133}
            height={133}
            className="object-cover h-[133px] rounded-full"
          />
        </div>
        <div className="w-[282px] mr-8">
          <div className="mb-4 text-start text-secondary-800">
            <p className="text-xl">
              <strong>{user_nickname}</strong>님
            </p>
            <p className="text-xl">행복한 국내 여행하세요</p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {buttons.map((button, index) => (
              <React.Fragment key={index}>
                <Button hover={true} buttonName={button.name} onClick={button.onClick} />
              </React.Fragment>
            ))}
          </div>
        </div>
        {buttons.some((button) => button.name === "내 정보 관리") && (
          <Modal id="profile">
            <ProfileManagement onClick={() => toggleModal("profile")} />
          </Modal>
        )}
        <div className="relative cursor-pointer" onClick={() => router.push("location")}>
          <div className="w-[467px] h-[131px] relative">
            <ProfileCarousel />
            <div className="absolute top-1 left-4 p-5 text-white font-extrabold text-lg pt-6 z-10 text-stroke-1 text-stroke-grey-900">
              <p className="text-start mb-5">이런 여행지는 어떠신가요</p>
              <p className="">
                주변 여행지 구경하러 가기 <span>&gt;</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
