"use client";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/zustand/userStore";

const supabase = createClient();
const DEFAULT_PROFILE_IMAGE_URL = "/assets/images/profile_ex.png";

const GoogleLoginButton: React.FC = () => {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const googleLogin = async (): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: process.env.NEXT_PUBLIC_CALLBACK_URL_FOR_GOOGLE,
        },
      });

      if (error) {
        console.error("Google 로그인 오류:", error);
        return;
      }

      const checkSession = async () => {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("세션 가져오기 오류:", sessionError);
          return null;
        }

        return sessionData?.session?.user || null;
      };

      let user = await checkSession();

      for (let i = 0; i < 3 && !user; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        user = await checkSession();
      }

      if (user) {
        const { id, email, user_metadata } = user;
        const user_nickname = user_metadata?.full_name || email || "";
        const profile_url = user_metadata?.picture || user_metadata?.avatar_url || DEFAULT_PROFILE_IMAGE_URL;

        const { error: upsertError } = await supabase.from("Users").upsert([
          {
            id: id,
            user_email: email || "",
            user_nickname: user_nickname || "",
            profile_url: profile_url,
            provider: "google",
            provider_id: id,
          },
        ]);

        if (upsertError) {
          console.error("사용자 정보 저장 오류:", upsertError);
          return;
        }

        setUser(id, email || "", user_nickname || "", profile_url, "google", id);
        router.push("/");
      } else {
        console.error("로그인 후 유저 정보를 가져오지 못했습니다.");
      }
    } catch (error) {
      console.error("Google 로그인 처리 중 오류:", error);
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
