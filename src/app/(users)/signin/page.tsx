// pages/login.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import EmailInput from "@/components/common/userspage/signinpage/EmailInput";
import PasswordInput from "@/components/common/userspage/signinpage/PasswordInput";
import LoginButton from "@/components/common/userspage/signinpage/LoginButton";
import SocialLoginButtons from "@/components/common/userspage/SocialLoginButtons";
import SignUpLink from "@/components/common/userspage/signinpage/SignUpLink";
import { useUserStore } from "@/zustand/userStore";
import { supabase } from "@/utils/supabase/client";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);

  const handleLogin = async () => {
    setError("");

    try {
      const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

      if (loginError) {
        setError(`로그인 실패: ${loginError.message}`);
        return;
      }

      if (sessionData?.session) {
        localStorage.setItem("supabaseSession", JSON.stringify(sessionData.session));

        queryClient.invalidateQueries({ queryKey: ["session"], exact: true });

        const userId = sessionData.user.id;
        const { data: userData, error: fetchError } = await supabase
          .from("Users")
          .select("id, user_email, user_nickname, profile_url, user_address")
          .eq("id", userId)
          .maybeSingle();

        if (fetchError) {
          setError(`사용자 데이터 가져오기 실패: ${fetchError.message}`);
          return;
        }

        if (userData) {
          setUser(userData.id, userData.user_email, userData.user_nickname, userData.profile_url);
          router.push("/");
        } else {
          setError("사용자 데이터를 찾을 수 없습니다.");
        }
      }
    } catch (error) {
      setError("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div
      className="relative items-center w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/assets/images/backgrounds/backgrounds.png)" }}
    >
      <div className="flex items-center justify-center pt-10">
        <div className="bg-white p-8 rounded-[40px] border border-gray-300 w-[503px] h-[530px]">
          <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="space-y-4 w-[401px] mx-auto h-[740px] overflow-auto">
            <EmailInput email={email} setEmail={setEmail} />
            <PasswordInput password={password} setPassword={setPassword} />
            <LoginButton onClick={handleLogin} />
            <div className="flex items-center justify-between mt-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="text-gray-500 mx-4">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            <SocialLoginButtons />
            <SignUpLink />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
