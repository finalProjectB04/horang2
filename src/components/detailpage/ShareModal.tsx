"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import KakaoShareButton from "./KakaoShareButton";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal = ({ isOpen, onClose }: ModalProps) => {
  const params = useParams() as { contentId: string };
  const [copiedUrl, setCopiedUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      const textToCopy = `${process.env.NEXT_PUBLIC_BASE_URL}/detail/${params.contentId}`;
      copyToClipboard(textToCopy);
    }
  }, [isOpen, params.contentId]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedUrl(text);
  };

  const handleCopyClick = () => {
    const textToCopy = `${process.env.NEXT_PUBLIC_BASE_URL}/detail/${params.contentId}`;
    copyToClipboard(textToCopy);
    alert("url이 복사되었습니다");
  };

  if (!isOpen) return null;

  return (
    <div className="mobile:fixed mobile:inset-0 bg-black bg-opacity-50 mobile:flex mobile:items-center mobile:justify-center z-50 tablet:fixed tablet:inset-0 bg-black bg-opacity-50 tablet:flex tablet:items-center tablet:justify-center z-50 desktop:fixed desktop:inset-0 bg-black bg-opacity-50 desktop:flex desktop:items-center desktop:justify-center z-50">
      <div className="bg-white mobile:p-3 mobile:rounded-md shadow-lg mobile:relative mobile:w-[280px] tablet:p-4 tablet:rounded-lg shadow-lg tablet:relative tablet:w-[320px] desktop:p-6 desktop:rounded-lg desktop:relative desktop:w-[480px]">
        <button
          className="mobile:absolute mobile:top-2 mobile:right-2 bg-transparent mobile:text-black hover:text-red-500 transition duration-300 ease-in-out focus:outline-none mobile:text-lg tablet:absolute tablet:top-2 tablet:right-2 bg-transparent tablet:text-black hover:text-red-500 transition duration-300 ease-in-out focus:outline-none tablet:text-xl desktop:absolute desktop:top-2 desktop:right-2 bg-transparent desktop:text-black hover:text-red-500 transition duration-300 ease-in-out focus:outline-none desktop:text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="mobile:text-center mobile:font-bold mobile:text-base mobile:mb-3 tablet:text-center tablet:font-bold tablet:text-lg tablet:mb-4 desktop:text-center desktop:font-bold desktop:text-xl desktop:mb-4">
          공유하기
        </div>
        <div className="mobile:flex mobile:items-center mobile:mb-3 tablet:flex tablet:items-center tablet:mb-4 desktop:flex desktop:items-center desktop:mb-4">
          <input
            type="text"
            value={copiedUrl}
            readOnly
            className="mobile:w-full mobile:px-3 mobile:py-2 mobile:border mobile:rounded-l-md bg-gray-100 tablet:w-full tablet:px-4 tablet:py-2 tablet:border tablet:rounded-l-md bg-gray-100 desktop:w-full desktop:px-4 desktop:py-2 desktop:border desktop:rounded-l-md bg-gray-100"
          />
          <button
            onClick={handleCopyClick}
            className="mobile:px-3 mobile:p-2 bg-primary-400 text-white mobile:rounded-md tablet:px-4 tablet:p-2 bg-primary-400 text-white tablet:rounded-xl desktop:px-4 desktop:p-2 bg-primary-400 text-white desktop:rounded-xl"
          >
            {">>"}
          </button>
        </div>
        <div className="mobile:flex mobile:justify-center tablet:flex tablet:justify-center desktop:flex desktop:justify-center">
          <KakaoShareButton id={params.contentId} className="hover:cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
