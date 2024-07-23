"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";
import SelectArea from "@/components/signuppage/selectarea";
import KakaoLoginButton from "@/components/common/kakaoLogin/KakaoLoginButton";

// Supabase 클라이언트 초기화
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// 기본 프로필 이미지 URL
const DEFAULT_PROFILE_IMAGE_URL = "/assets/images/profile_ex.png";

const SignUpPage = () => {
  const [email, setEmail] = useState(""); // 이메일 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 상태
  const [area, setArea] = useState(""); // 지역 상태
  const [subArea, setSubArea] = useState(""); // 하위 지역 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const [nickname, setNickname] = useState(""); // 닉네임 상태
  const [profileImage, setProfileImage] = useState<File | null>(null); // 프로필 이미지 상태
  const [profileImageUrl, setProfileImageUrl] = useState(DEFAULT_PROFILE_IMAGE_URL); // 프로필 이미지 URL 상태
  const router = useRouter(); // 라우터 훅

  // 프로필 이미지 클릭 핸들러
  const handleImageClick = () => {
    document.getElementById("profileImageInput")?.click();
  };

  // 파일 선택 핸들러
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfileImage(file);

      // 이미지 미리보기
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 회원가입 처리 함수
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 회원가입 요청
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      setError(`회원가입 실패: ${signUpError.message}`);
      console.error("회원가입 실패:", signUpError);
      return;
    }

    if (signUpData && signUpData.user) {
      let profileImagePath = "";

      if (profileImage) {
        const filePath = `${signUpData.user.id}`;

        // 이미지 업로드
        const { error: uploadError } = await supabase.storage.from("profiles").upload(filePath, profileImage);

        if (uploadError) {
          setError(`프로필 이미지 업로드 실패: ${uploadError.message}`);
          console.error("프로필 이미지 업로드 실패:", uploadError);
          return;
        }

        // 업로드된 이미지 URL 가져오기
        const { data: urlData } = supabase.storage.from("profiles").getPublicUrl(filePath);
        profileImagePath = urlData?.publicUrl || "";
      }

      const formattedAddress = `${area.trim()} ${subArea.trim()}`;

      // 사용자 정보 저장
      const { error: insertError } = await supabase.from("Users").insert([
        {
          id: signUpData.user.id,
          created_at: new Date().toISOString(),
          user_nickname: nickname,
          profile_url: profileImagePath || DEFAULT_PROFILE_IMAGE_URL, // 기본 이미지 URL을 사용
          user_email: email,
          user_address: formattedAddress,
        },
      ]);

      if (insertError) {
        setError(`사용자 정보 저장 실패: ${insertError.message}`);
        console.error("사용자 정보 저장 실패:", insertError);
        return;
      }

      // 회원가입 후 로그인 페이지로 리디렉션
      router.push("/signin");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div className="flex flex-col items-center mb-6">
          <div onClick={handleImageClick} className="relative w-24 h-24 mb-4 cursor-pointer">
            <Image
              src={profileImageUrl} // 프로필 이미지 URL
              alt="Profile Image"
              layout="intrinsic"
              width={96}
              height={96}
              objectFit="cover"
              className="rounded-full border-2 border-gray-300"
            />
            <input type="file" id="profileImageInput" className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
              닉네임
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
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

          <div>
            <p className="text-sm mb-3 font-medium text-gray-500 text-center">거주지를 선택해 주세요!</p>
            <SelectArea area={area} subArea={subArea} setArea={setArea} setSubArea={setSubArea} />
          </div>

          <button
            onClick={handleSignUp}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            회원가입
          </button>

          <div className="flex items-center justify-between mt-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 mx-4">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="flex flex-col space-y-4 mt-4">
            <KakaoLoginButton />
            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">구글 로그인</button>
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-500">이미 계정이 있으신가요?</p>
            <Link href="/signin" className="text-blue-500">
              로그인하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
