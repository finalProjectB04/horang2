"use client";

import useAuth from "@/hooks/useAuth";
import Image from "next/image";

interface ProfileManagementProps {
  onClick: () => void;
}

const ProfileManagement: React.FC<ProfileManagementProps> = ({ onClick }) => {
  const {
    handleImageClick,
    handleImageChange,
    handleUpdateUser,
    handleUpadatePassword,
    previewUrl,
    nickname,
    setNickname,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
  } = useAuth();

  const handleSubmit = async () => {
    try {
      if (password.length < 6 && confirmPassword.length < 6) {
        return alert("비밀번호는 6글자 이상이어야 합니다.");
      }
      if (password !== confirmPassword) {
        return alert("입력하신 비밀번호가 다릅니다.");
      }
      if (!confirm("정말 변경하시겠습니까?")) {
        return;
      }
      await handleUpadatePassword();
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
            layout="intrinsic"
            width={96}
            height={96}
            objectFit="cover"
            className="rounded-full border-2 border-gray-300"
          />
          <input type="file" id="profileImage" className="hidden" accept="image/*" onChange={handleImageChange} />
        </div>
        <form>
          <label htmlFor="nickname" className="block text-sm text-start mt-4 font-medium text-gray-700">
            새로운 닉네임
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
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
            onChange={(event) => setPassword(event.target.value)}
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
            onChange={(event) => setConfirmPassword(event.target.value)}
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
