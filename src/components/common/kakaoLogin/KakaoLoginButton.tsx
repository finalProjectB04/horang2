"use client";

import { supabase } from "../contexts/supabase.context";

const KakaoLoginButton = () => {
  const kakaoLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_API_URL}`,
      },
    });
  };

  return (
    <button onClick={kakaoLogin} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
      카카오 로그인
    </button>
  );
};

export default KakaoLoginButton;
