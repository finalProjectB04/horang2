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
    <div className="desktop:fixed desktop:inset-0 bg-black bg-opacity-50 desktop:flex desktop:items-center desktop:justify-center z-50">
      <div className="bg-white desktop:p-6 desktop:rounded-lg shadow-lg desktop:relative" style={{ width: "480px" }}>
        <button
          className="desktop:absolute desktop:top-2 desktop:right-2 bg-transparent desktop:text-black hover:text-red-500 transition duration-300 ease-in-out focus:outline-none desktop:text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="desktop:text-center desktop:font-bold desktop:text-xl desktop:mb-4">공유하기</div>
        <div className="desktop:flex desktop:items-center desktop:mb-4">
          <input
            type="text"
            value={copiedUrl}
            readOnly
            className="desktop:w-full desktop:px-4 desktop:py-2 desktop:border desktop:rounded-l-md bg-gray-100"
          />
          <button
            onClick={handleCopyClick}
            className="desktop:px-4 desktop:p-2 bg-primary-400 text-white desktop:rounded-xl"
          >
            {">>"}
          </button>
        </div>
        <div className="desktop:flex desktop:justify-center">
          <KakaoShareButton id={params.contentId} className="hover:cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
