"use client";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

const supabase = createClient();

const KakaoLoginButton = () => {
  const kakaoLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
      },
    });
  };

  return (
    <button
      onClick={kakaoLogin}
      className="flex items-center justify-center bg-[#FEE500] border border-gray-300 rounded-lg shadow-md hover:bg-yellow-400 cursor-pointer p-2"
    >
      <Image src="/assets/images/login_logo/kakao_logo.png" alt="Kakao Logo" width={24} height={24} />
      <span className="font-semibold text-gray-800 ml-2">카카오 로그인</span>
    </button>
  );
};

export default KakaoLoginButton;
