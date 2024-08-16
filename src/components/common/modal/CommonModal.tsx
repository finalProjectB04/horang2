"use client";

import { useModal } from "@/context/modal.context";
import { useRouter } from "next/navigation";
import BackDrop from "./BackDrop";

interface CommonModalProps {
  title: string;
  content: React.ReactNode | null;
  path?: string;
  type?: "normal" | "confirm";
  onClose?: () => void;
}

const CommonModal = ({ title, content, path, type = "normal", onClose }: CommonModalProps) => {
  const modal = useModal();
  const router = useRouter();

  const handleConfirmClick = () => {
    if (type === "confirm") {
      modal.confirmClose();
    } else {
      if (path) {
        router.push(`${path}`);
      }
      modal.close();
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <BackDrop>
      <section className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center max-w-72 w-full p-8 gap-4 rounded-lg bg-white z-[9999]">
        <h2 className="text-2xl font-semibold mb-2 text-center">{title}</h2>
        <div className="modal-content">{content}</div>
        {/* {type === "normal" && ( */}
        <button
          className="px-4 py-1 bg-primary-400 text-white font-semibold border border-gray-200 rounded hover:opacity-85 active:opacity-75"
          onClick={handleConfirmClick}
        >
          확인
        </button>
        {/* )} */}
      </section>
    </BackDrop>
  );
};

export default CommonModal;
