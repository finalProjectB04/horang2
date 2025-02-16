"use client";

import { useModal } from "@/context/modal.context";
import useAuth from "@/hooks/useAuth";
import useCustomConfirm from "@/hooks/useCustomConfirm";
import Image from "next/image";
import { useState } from "react";

interface ProfileManagementProps {
  onClick: () => void;
}

const ProfileManagement: React.FC<ProfileManagementProps> = ({ onClick }) => {
  const {
    handleImageClick,
    handleImageChange,
    handleUpdateUser,
    handleUpdatePassword,
    previewUrl,
    nickname,
    setNickname,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
  } = useAuth();
  const modal = useModal();
  const confirm = useCustomConfirm();

  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!nickname) {
        return modal.open({
          title: "실패",
          content: (
            <div className="text-center ">
              <p>닉네임을 입력해주세요</p>
            </div>
          ),
        });
      }
      if (showPasswordFields) {
        if (password.length < 6 || confirmPassword.length < 6) {
          return modal.open({
            title: "실패",
            content: (
              <div className="text-center ">
                <p>비밀번호는 6글자 이상이어야 합니다.</p>
              </div>
            ),
          });
        }
        if (password !== confirmPassword) {
          return modal.open({
            title: "실패",
            content: (
              <div className="text-center ">
                <p>입력하신 비밀번호가 다릅니다.</p>
              </div>
            ),
          });
        }
        await handleUpdatePassword();
      }
      if (!confirm("정말 변경하시겠습니까?")) {
        return;
      }
      await handleUpdateUser();
      onClick();
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <div onClick={handleImageClick} className="relative w-24 h-24 mb-4 cursor-pointer">
          <Image
            src={previewUrl}
            alt="Profile Image"
            width={96}
            height={96}
            layout="fixed"
            className="rounded-full border-2 border-grey-300 object-cover h-24"
          />
          <input type="file" id="profileImage" className="hidden" accept="image/*" onChange={handleImageChange} />
          <div className="absolute bottom-0 right-0 mb-0 mr-0">
            <Image
              src="/assets/images/edit_image.png"
              alt="edit_image"
              width={35}
              height={35}
              className="relative z-10"
            />
          </div>
        </div>
        <form>
          <label htmlFor="nickname" className="block text-sm text-start mt-4 font-medium text-grey-700">
            새로운 닉네임
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname!}
            onChange={(event) => setNickname(event.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-bl text-black"
            required
          />

          <button
            type="button"
            className="mt-4 text-sm text-indigo-600 hover:underline"
            onClick={() => setShowPasswordFields((prev) => !prev)}
          >
            {showPasswordFields ? "비밀번호 변경 숨기기" : "비밀번호 변경하기"}
          </button>

          {showPasswordFields && (
            <>
              <label htmlFor="password" className="block text-sm text-start mt-4 font-medium text-grey-700">
                새로운 비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                required
              />
              <label htmlFor="confirmPassword" className="block text-sm text-start mt-4 font-medium text-grey-700">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-grey-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                required
              />
            </>
          )}
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
            className="px-4 py-2 border border-grey-300 text-sm font-medium rounded-md text-grey-700 bg-white hover:bg-grey-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onClick}
          >
            닫기
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileManagement;
