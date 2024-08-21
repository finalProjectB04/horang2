"use client";

import ShareModal from "@/components/detailpage/share/ShareModal";
import Image from "next/image";
import { useState } from "react";

const ShareButtonWithModal: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex justify-center space-x-4">
      <button onClick={() => setIsModalOpen(true)}>
        <Image
          src="/assets/images/shareModal.svg"
          alt="Custom Button Image"
          width={32}
          height={32}
          className="sm:w-[24px] sm:h-[24px] md:w-[28px] md:h-[28px]"
        />
      </button>
      <ShareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ShareButtonWithModal;
