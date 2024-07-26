"use client";

import Button from "@/components/common/button";
import { useRouter } from "next/navigation";

const ErrorPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col justify-center items-center gap-2 text-3xl font-semibold">
      <p>오류가 발생 했습니다.</p>
      <Button
        buttonName="재시도"
        onClick={() => {
          router.refresh();
        }}
      />
      <Button
        buttonName="홈으로 가기"
        onClick={() => {
          router.push("/");
        }}
      />
    </div>
  );
};

export default ErrorPage;
