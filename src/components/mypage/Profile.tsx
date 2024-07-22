"use client";

import Image from "next/image";
import React from "react";
import Button from "../common/button";
import useModalStore from "@/zustand/ModalStore";
import Modal from "../common/Modal";
import ProfileManagement from "./ProfileManagement";

const Profile: React.FC = () => {
  const {toggleModal} = useModalStore()

  const hadleGoProfile = () => {
    console.log("동작");
    toggleModal("profile")
  };
  const hadleGoChat = () => {
    console.log("동작");
  };
  const hadleGoMyCourse = () => {
    console.log("동작");
  };

  return (
    <section className="border-b-2 flex justify-center items-center p-5 mb-5">
      <div className="mr-8">
        <Image src="/assets/images/profile_ex.png" alt="profile" width={200} height={200} />
      </div>
      <div className="mr-8">
        <p className="mb-5 text-start font-semibold text-2xl">뫄뫄님 안녕하세요</p>
        <div className="grid grid-cols-2 gap-4">
          <Button hover={true} buttonName="회원정보 관리" onClick={hadleGoProfile} />
          <Button hover={true} buttonName="채팅" onClick={hadleGoChat} />
          <Button hover={true} buttonName="회원정보 관리" onClick={hadleGoProfile} />
          <Modal id="profile"><ProfileManagement onClick={()=>toggleModal("profile")}/></Modal>
          <Button hover={true} buttonName="내 취향 코스 짜기" onClick={hadleGoMyCourse} />
        </div>
      </div>
      <div className="relative">
        <Image src="/assets/images/ex1.png" alt="profile" width={600} height={200} />
        <div className="absolute top-5 left-8 p-5 text-white font-extrabold text-3xl pt-10">
          <p className="text-start mb-5">이런 여행지는 어떠신가요</p>
          <p>
            주변 여행지 구경하러 가기 <span>&gt;</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Profile;
