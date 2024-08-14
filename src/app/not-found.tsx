"use client";

import Button from "@/components/common/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NotFoundPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="h-[calc(100vh)] flex flex-col justify-center items-center text-3xl font-semibold">
      <Image src="/assets/images/404.png" width={1920} height={1000} alt="임시 사용" className="w-screen h-screen" />
      <div className="bg-secondary-400 w-screen h-screen flex items-center justify-center">
        <button
          className="border border-primary-300 rounded-xl text-primary-300 bg-gray-800 p-2 hover:text-white"
          onClick={() => router.push("/")}
        >
          호랑 메인 이동하기
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
