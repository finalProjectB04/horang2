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
    <div className="tablet:fixed tablet:inset-0 bg-black bg-opacity-50 tablet:flex tablet:items-center tablet:justify-center z-50 desktop:fixed desktop:inset-0 bg-black bg-opacity-50 desktop:flex desktop:items-center desktop:justify-center z-50">
      <div className="bg-white tablet:p-4 tablet:rounded-lg shadow-lg tablet:relative tablet:w-[320px] desktop:p-6 desktop:rounded-lg desktop:relative desktop:w-[480px]">
        <button
          className="tablet:absolute tablet:top-2 tablet:right-2 bg-transparent tablet:text-black hover:text-red-500 transition duration-300 ease-in-out focus:outline-none tablet:text-xl desktop:absolute desktop:top-2 desktop:right-2 bg-transparent desktop:text-black hover:text-red-500 transition duration-300 ease-in-out focus:outline-none desktop:text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="tablet:text-center tablet:font-bold tablet:text-lg tablet:mb-4 desktop:text-center desktop:font-bold desktop:text-xl desktop:mb-4">
          공유하기
        </div>
        <div className="tablet:flex tablet:items-center tablet:mb-4 desktop:flex desktop:items-center desktop:mb-4">
          <input
            type="text"
            value={copiedUrl}
            readOnly
            className="tablet:w-full tablet:px-4 tablet:py-2 tablet:border tablet:rounded-l-md bg-gray-100 desktop:w-full desktop:px-4 desktop:py-2 desktop:border desktop:rounded-l-md bg-gray-100"
          />
          <button
            onClick={handleCopyClick}
            className="tablet:px-4 tablet:p-2 bg-primary-400 text-white tablet:rounded-xl desktop:px-4 desktop:p-2 bg-primary-400 text-white desktop:rounded-xl"
          >
            {">>"}
          </button>
        </div>
        <div className="tablet:flex tablet:justify-center desktop:flex desktop:justify-center">
          <KakaoShareButton id={params.contentId} className="hover:cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
