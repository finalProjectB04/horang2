"use client";

import { useModal } from "@/context/modal.context";
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
  const modal = useModal();

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
    modal.open({
      title: "알림",
      content: (
        <div className="text-center">
          <p>url이 복사 되었습니다.</p>
        </div>
      ),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:max-w-[375px]">
      <div className="bg-white p-3 rounded-md shadow-lg relative w-[280px] md:w-[320px] lg:w-[480px]">
        <button
          className="absolute top-2 right-2 bg-transparent text-black hover:text-red-500 transition duration-300 ease-in-out focus:outline-none text-lg"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="text-center font-bold text-base mb-3 md:text-lg md:mb-4 lg:text-xl lg:mb-4">공유하기</div>
        <div className="flex items-center mb-3 md:mb-4 lg:mb-4">
          <input type="text" value={copiedUrl} readOnly className="w-full px-3 py-2 border rounded-l-md bg-gray-100" />
          <button onClick={handleCopyClick} className="px-3 p-2 bg-primary-400 text-white rounded-md">
            {">>"}
          </button>
        </div>
        <div className="flex justify-center">
          <KakaoShareButton id={params.contentId} className="hover:cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
