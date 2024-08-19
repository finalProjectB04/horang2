"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EmailInput from "@/components/common/userspage/signinpage/EmailInput";
import PasswordInput from "@/components/common/userspage/signinpage/PasswordInput";
import LoginButton from "@/components/common/userspage/signinpage/LoginButton";
import SocialLoginButtons from "@/components/common/userspage/SocialLoginButtons";
import SignInLink from "@/components/common/userspage/signinpage/SignInLink";
import useRedirectIfLoggedIn from "@/components/common/userspage/useRedirectIfLoggedIn ";
import { useUserStore } from "@/zustand/userStore";
import { useModal } from "@/context/modal.context";

const LoginPage = () => {
  useRedirectIfLoggedIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const { open } = useModal();

  const handleLogin = async () => {
    if (!email) {
      open({ title: "오류", content: "이메일을 입력해 주세요." });
      return;
    }

    if (!password) {
      open({ title: "오류", content: "비밀번호를 입력해 주세요." });
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { id, user_email, user_nickname, profile_url, provider, provider_id } = data;
        setUser(id, user_email, user_nickname, profile_url, provider, provider_id);
        router.push("/");
      } else {
        if (data.error === "Invalid login credentials") {
          open({ title: "로그인 오류", content: "이메일 또는 비밀번호가 올바르지 않습니다." });
        } else {
          open({ title: "로그인 오류", content: data.error });
        }
      }
    } catch (error) {
      open({ title: "오류", content: "로그인 중 오류가 발생했습니다." });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleLogin();
  };

  return (
    <div className="flex items-center justify-center w-full h-screen bg-cover bg-center bg-[url('/assets/images/backgrounds/backgrounds.svg')] sm:bg-[url('/assets/images/backgrounds/m_signup.png')]">
      <div className="bg-white p-8 rounded-[40px] border border-gray-300 w-full max-w-[500px] sm:max-w-[327px]">
        <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <EmailInput email={email} setEmail={setEmail} />
          <PasswordInput password={password} setPassword={setPassword} />
          <LoginButton onClick={handleLogin} />
          <div className="flex items-center justify-between mt-4 w-full max-w-[280px] mx-auto">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 mx-4">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          <SocialLoginButtons />
          <SignInLink />
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
