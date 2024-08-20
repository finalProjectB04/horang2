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

const validatePassword = (password: string) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const validateNickname = (nickname: string) => /^[a-zA-Z0-9_-]{3,10}$/.test(nickname);

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
    if (!validateNickname(nickname))
      return open({
        title: "오류",
        content: "닉네임은 3자에서 10자 사이여야 하며, 알파벳, 숫자, 밑줄, 대시만 포함할 수 있습니다.",
      });
    if (!email) return open({ title: "오류", content: "이메일을 입력해 주세요." });
    if (!validateEmail(email)) return open({ title: "오류", content: "유효한 이메일 주소를 입력해 주세요." });
    if (!password) return open({ title: "오류", content: "비밀번호를 입력해 주세요." });
    if (!validatePassword(password))
      return open({
        title: "오류",
        content: "비밀번호는 최소 8자 이상이어야 하며, 대문자, 소문자, 숫자 및 특수 문자가 포함되어야 합니다.",
      });
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
    if (signUpError) {
      if (signUpError.message.includes("User already registered")) {
        return open({ title: "회원가입 실패", content: "이미 등록된 이메일 주소입니다. 다른 이메일을 사용해 주세요." });
      }
      return open({ title: "회원가입 실패", content: signUpError.message });
    }

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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleSignUp();
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-cover bg-center bg-[url('/assets/images/backgrounds/backgrounds.svg')] sm:bg-[url('/assets/images/backgrounds/m_signup.png')]">
      <div className="bg-white p-8 rounded-[40px] border border-grey-300 w-full max-w-[503px] sm:max-w-[327px]">
        <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-[401px] mx-auto sm:max-w-[280px]">
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
            <div className="flex-1 border-t border-grey-300"></div>
            <span className="text-grey-500 mx-4">OR</span>
            <div className="flex-1 border-t border-grey-300"></div>
          </div>
        </form>
        <SocialLoginButtons />
        <SignUpLinks />
      </div>
    </div>
  );
};

export default SignUpPage;
