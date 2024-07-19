"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link"; // Link 컴포넌트 import
import SelectArea from "@/components/SignupPage/SelectArea"; // SelectArea 컴포넌트 import
import KakaoLoginButton from "@/components/common/kakaoLogin/KakaoLoginButton";

// Supabase 클라이언트 초기화
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const SignUpPage = () => {
  // 상태 변수 선언
  const [email, setEmail] = useState(""); // 이메일 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 상태
  const [area, setArea] = useState(""); // 지역 상태
  const [subArea, setSubArea] = useState(""); // 하위 지역 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const router = useRouter(); // 라우터 훅

  // 회원가입 처리 함수
  const handleSignUp = async () => {
    // 비밀번호 확인
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // Supabase를 사용한 회원가입 요청
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    // 콘솔에 Supabase 데이터 및 에러 출력
    console.log("회원가입 데이터:", data);
    console.log("회원가입 에러:", signUpError);

    // 에러 처리
    if (signUpError) {
      setError(`회원가입 실패: ${signUpError.message}`);
      return;
    }

    // 회원가입 성공 후 사용자 정보를 Users 테이블에 삽입
    if (data && data.user) {
      const { error: insertError } = await supabase.from("Users").insert([
        {
          id: data.user.id,
          created_at: new Date().toISOString(),
          user_nickname: "", // 사용자 닉네임 초기값 설정
          profile_url: "", // 프로필 URL 초기값 설정
          user_email: email,
          user_address: `${area}, ${subArea}`, // 지역 및 하위 지역 조합
        },
      ]);

      // 콘솔에 Users 테이블 데이터 및 에러 출력
      console.log("Users 테이블 삽입 에러:", insertError);

      if (insertError) {
        setError(`사용자 정보 저장 실패: ${insertError.message}`);
        return;
      }

      // 성공 시 로그인 페이지로 이동
      router.push("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* 회원가입 폼을 감싸는 컨테이너 */}
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        {/* 페이지 제목 */}
        <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>

        {/* 에러 메시지 표시 */}
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="space-y-4">
          {/* 이메일 입력 필드 */}
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

          {/* 비밀번호 입력 필드 */}
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

          {/* 비밀번호 확인 입력 필드 */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          {/* 거주지 선택 필드 */}
          <div>
            <p className="text-sm mb-3 font-medium text-gray-500 text-center">거주지를 선택해 주세요!</p>
            <SelectArea area={area} subArea={subArea} setArea={setArea} setSubArea={setSubArea} />{" "}
            {/* SelectArea 컴포넌트 */}
          </div>

          {/* 회원가입 버튼 */}
          <button
            onClick={handleSignUp}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            회원가입
          </button>

          {/* 구분선 및 'OR' 텍스트 */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 mx-4">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* 소셜 로그인 버튼들 */}
          <div className="flex flex-col space-y-4 mt-4">
            <KakaoLoginButton />
            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">구글 로그인</button>
          </div>

          {/* 계정이 이미 있는 경우 링크 */}
          <div className="text-center mt-4">
            <p className="text-gray-500">
              이미 계정이 있으신가요?{" "}
              <Link href="/login" className="text-blue-500">
                로그인하기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
