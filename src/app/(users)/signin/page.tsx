"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import KakaoLoginButton from "@/components/common/loginbutton/kakaologin/KakaoLoginButton";
import GoogleLoginButton from "@/components/common/loginbutton/googleLoginbutton";
import { useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/zustand/userStore";

// Supabase 클라이언트 초기화
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const LoginPage = () => {
  const [email, setEmail] = useState(""); // 이메일 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const router = useRouter(); // 라우터 훅
  const queryClient = useQueryClient(); // React Query 클라이언트
  const setUser = useUserStore((state) => state.setUser); // Zustand 스토어에서 setUser 함수 가져오기

  // 로그인 처리 함수
  const handleLogin = async () => {
    setError(""); // 에러 메시지 초기화

    // 로그인 요청
    const { data: sessionData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      setError(`로그인 실패: ${loginError.message}`);
      console.error("로그인 실패:", loginError);
      return;
    }

    if (sessionData && sessionData.session) {
      // 로그인 성공 시 세션 정보를 로컬 스토리지에 저장
      localStorage.setItem("supabaseSession", JSON.stringify(sessionData.session));

      // 세션 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ["session"],
        exact: true,
      });

      // 사용자 데이터 가져오기
      const userId = sessionData.user.id;
      const { data: userData, error: fetchError } = await supabase
        .from("Users")
        .select("id, user_email, user_nickname, profile_url, user_address")
        .eq("id", userId)
        .single();

      if (fetchError) {
        console.error("Error fetching user data:", fetchError);
        return;
      }

      if (userData) {
        // Zustand 스토어에 사용자 정보 저장
        setUser(userData.id, userData.user_email, userData.user_nickname, userData.profile_url);

        // 홈 페이지로 리디렉션
        router.push("/");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              이메일 주소
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            로그인
          </button>

          <div className="flex items-center justify-between mt-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 mx-4">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="flex flex-col space-y-4 mt-4">
            <KakaoLoginButton />
            <GoogleLoginButton />
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-500">계정이 없으신가요?</p>
            <Link href="/signup" className="text-blue-500">
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
