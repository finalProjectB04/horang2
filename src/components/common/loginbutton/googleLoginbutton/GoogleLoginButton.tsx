"use client";

import { supabase } from "@/utils/supabase/client";
import Image from "next/image";

const GoogleLoginButton: React.FC = () => {
  const googleLogin = async (): Promise<void> => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_API_URL}/auth/callback`,
        },
      });
    } catch (error) {
      console.error("Google 로그인 오류:", error);
    }
  };

  return (
    <button
      onClick={googleLogin}
      className="flex items-center justify-center bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 cursor-pointer p-2"
    >
      <Image src="/assets/images/login_logo/google_logo.png" alt="Google Logo" width={24} height={24} />
      <span className="font-semibold text-gray-800 ml-2">구글 로그인</span>
    </button>
  );
};

export default GoogleLoginButton;
