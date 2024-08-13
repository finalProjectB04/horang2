"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import SignUpForm from "@/components/common/userspage/signuppage/SignUpForm";
import SignUpLinks from "@/components/common/userspage/signuppage/SignInLink";
import SocialLoginButtons from "@/components/common/userspage/SocialLoginButtons";
import useRedirectIfLoggedIn from "@/components/common/userspage/useRedirectIfLoggedIn ";
import { useModal } from "@/context/modal.context";

const DEFAULT_PROFILE_IMAGE_URL = "/assets/images/profile_ex.png";

const supabase = createClient();

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const SignUpPage = () => {
  useRedirectIfLoggedIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();
  const { open } = useModal();

  const handleSignUp = async () => {
    if (!nickname) return open({ title: "오류", content: "닉네임을 입력해 주세요." });
    if (!email) return open({ title: "오류", content: "이메일을 입력해 주세요." });
    if (!validateEmail(email)) return open({ title: "오류", content: "유효한 이메일 주소를 입력해 주세요." });
    if (password.length < 6) return open({ title: "오류", content: "비밀번호는 6자 이상이어야 합니다." });
    if (password !== confirmPassword) return open({ title: "오류", content: "비밀번호가 일치하지 않습니다." });

    const { data: existingNickname } = await supabase.from("Users").select("*").eq("user_nickname", nickname).single();

    if (existingNickname) {
      return open({ title: "오류", content: "이미 사용 중인 닉네임입니다." });
    }

    const { data: existingEmail } = await supabase.from("Users").select("*").eq("user_email", email).single();

    if (existingEmail) {
      return open({ title: "오류", content: "이미 사용 중인 이메일 주소입니다." });
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) return open({ title: "회원가입 실패", content: signUpError.message });

    if (signUpData?.user) {
      const profileImagePath = DEFAULT_PROFILE_IMAGE_URL;

      const { error: insertError } = await supabase.from("Users").insert([
        {
          id: signUpData.user.id,
          created_at: new Date().toISOString(),
          user_nickname: nickname,
          profile_url: profileImagePath,
          user_email: email,
          provider: "email",
          provider_id: signUpData.user.id,
        },
      ]);

      if (insertError) return open({ title: "오류", content: `사용자 정보 저장 실패: ${insertError.message}` });

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) return open({ title: "오류", content: `자동 로그인 실패: ${signInError.message}` });

      if (signInData.session) {
        setUser(signUpData.user.id, email, nickname, profileImagePath, "email", signUpData.user.id);
      }

      queryClient.invalidateQueries({ queryKey: ["session"], exact: true });
      router.push("/");
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-cover bg-center bg-[url('/assets/images/backgrounds/backgrounds.png')] sm:bg-[url('/assets/images/backgrounds/m_signup.png')]">
      <div className="bg-white p-8 rounded-[40px] border border-gray-300 w-full max-w-[503px] sm:max-w-[327px]">
        <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>
        <div className="space-y-4 w-full max-w-[401px] mx-auto sm:max-w-[280px]">
          <SignUpForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            nickname={nickname}
            setNickname={setNickname}
            handleSignUp={handleSignUp}
          />
          <div className="flex items-center justify-between mt-4 w-full max-w-[280px] mx-auto">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 mx-4">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          <SocialLoginButtons />
          <SignUpLinks />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
