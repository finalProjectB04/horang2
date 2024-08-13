"use client";

import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/zustand/userStore";
import { useModal } from "@/context/modal.context";

const supabase = createClient();
const DEFAULT_PROFILE_IMAGE_URL = "/assets/images/profile_ex.png";

const KakaoLoginButton = () => {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const { open } = useModal();

  const kakaoLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
          redirectTo: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
        },
      });

      if (error) {
        open({ title: "로그인 오류", content: "OAuth 로그인 중 오류가 발생했습니다. 다시 시도해 주세요." });
        console.error("OAuth 로그인 오류:", error);
        return;
      }

      const fetchSession = async () => {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("세션 가져오기 오류:", sessionError);
          return null;
        }
        return sessionData?.session?.user || null;
      };

      let user = await fetchSession();

      for (let i = 0; i < 3 && !user; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        user = await fetchSession();
      }

      if (user) {
        const { id, email, user_metadata } = user;
        const user_nickname = user_metadata?.full_name || email || "";
        const profile_url = DEFAULT_PROFILE_IMAGE_URL;

        const { error: upsertError } = await supabase.from("Users").upsert([
          {
            id: id,
            user_email: email || "",
            user_nickname: user_nickname || "",
            profile_url: profile_url,
            provider: "kakao",
            provider_id: id,
          },
        ]);

        if (upsertError) {
          open({ title: "오류", content: "사용자 정보를 저장하는 중 오류가 발생했습니다." });
          console.error("사용자 정보 저장 오류:", upsertError);
          return;
        }

        setUser(id, email || "", user_nickname || "", profile_url, "kakao", id);
        router.push("/");
      } else {
        open({ title: "로그인 실패", content: "로그인 후 유저 정보를 가져오지 못했습니다. 다시 시도해 주세요." });
        console.error("로그인 후 유저 정보를 가져오지 못했습니다.");
      }
    } catch (error) {
      open({ title: "로그인 오류", content: "로그인 중 문제가 발생했습니다. 다시 시도해 주세요." });
      console.error("로그인 처리 중 오류:", error);
    }
  };

  return (
    <button
      onClick={kakaoLogin}
      className="flex items-center justify-center bg-[#FFD600] border border-gray-300 rounded-lg shadow-md hover:bg-yellow-400 cursor-pointer p-2"
    >
      <Image src="/assets/images/login_logo/kakao_logo.png" alt="Kakao Logo" width={24} height={24} />
      <span className="font-semibold text-gray-800 ml-2">카카오 로그인</span>
    </button>
  );
};

export default KakaoLoginButton;
