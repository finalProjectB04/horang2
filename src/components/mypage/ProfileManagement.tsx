"use client";

import useFileChange from "@/hooks/useFileChange";
import { supabase } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import Image from "next/image";
import React, { ChangeEvent, useState } from "react";

interface ProfileManagementProps {
  onClick: () => void;
}

const ProfileManagement: React.FC<ProfileManagementProps> = ({ onClick }) => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { id, user_email, setUser } = useUserStore();

  const { handleImageClick, handleFileChange, profileImageUrl } = useFileChange();

  const handleUpdateUser = async () => {
    try {
      const { error } = await supabase
        .from("Users")
        .update({ user_nickname: nickname, profile_url: profileImageUrl })
        .eq("id", id as string);
      if (error) {
        console.error("Error", error);
      } else {
        console.log("유저 정보 변경 완료");
        setUser(id as string, user_email as string, nickname, profileImageUrl);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (password.length < 6 && confirmPassword.length < 6) return alert("비밀번호는 6글자 이상이어야 합니다.");
      if (password !== confirmPassword) return alert("입력하신 비밀번호가 다릅니다.");
      if (!confirm("정말 비밀번호를 변경하시겠습니까?")) {
        return;
      }
      if (password === confirmPassword) {
        const { error: updateError } = await supabase.auth.updateUser({ password: confirmPassword });
        if (!updateError) {
          alert("비밀번호 변경이 완료되었습니다.");
          setPassword("");
          setConfirmPassword("");
        } else {
          alert(updateError.message);
        }
      } else {
        alert("비밀번호가 일치하는 지 다시 확인해주세요.");
      }
      handleUpdateUser();
      onClick();
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleCancel = () => {
    onClick();
  };

  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <div onClick={handleImageClick} className="relative w-24 h-24 mb-4 cursor-pointer">
          <Image
            src={profileImageUrl}
            alt="Profile Image"
            layout="intrinsic"
            width={96}
            height={96}
            objectFit="cover"
            className="rounded-full border-2 border-gray-300"
          />
          <input type="file" id="profileImageInput1" className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
        <form>
          <label htmlFor="nickname" className="block text-sm text-start mt-4 font-medium text-gray-700">
            새로운 닉네임
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
          <label htmlFor="nickname" className="block text-sm text-start mt-4 font-medium text-gray-700">
            새로운 비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
          <label htmlFor="nickname" className="block text-sm text-start mt-4 font-medium text-gray-700">
            비밀번호 확인
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </form>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="mr-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleSubmit}
          >
            확인
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleCancel}
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileManagement;
