"use client";

import Button from "@/components/common/button";
import { useRouter } from "next/navigation";

const NotFoundPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col justify-center items-center gap-2 text-3xl font-semibold">
      <p>없는 페이지입니다.</p>
      <Button
        buttonName="홈으로 가기"
        onClick={() => {
          router.push("/");
        }}
      />
    </div>
  );
};

export default NotFoundPage;
