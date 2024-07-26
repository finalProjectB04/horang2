"use client";

import { supabase } from "@/utils/supabase/client";
import Image from "next/image"; // Next.js Image 컴포넌트 사용

const KakaoLoginButton = () => {
  // 카카오 로그인 함수
  const kakaoLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/auth/callback`, // 카카오 인증 후 리디렉션할 URL
      },
    });
  };

  return (
    <button
      onClick={kakaoLogin}
      className="flex items-center justify-center bg-[#FEE500] border border-gray-300 rounded-lg shadow-md hover:bg-yellow-400 cursor-pointer p-2"
    >
      <Image
        src="/assets/images/login_logo/kakao_logo.png" // 이미지 경로가 정확한지 확인하세요
        alt="Kakao Logo"
        width={24} // 이미지 너비
        height={24} // 이미지 높이
      />
      <span className="font-semibold text-gray-800 ml-2">카카오 로그인</span>
    </button>
  );
};

export default KakaoLoginButton;
