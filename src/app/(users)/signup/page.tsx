"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/zustand/userStore";
import ProfileImage from "@/components/common/userspage/signuppage/ProfileImage";
import SignUpForm from "@/components/common/userspage/signuppage/SignUpForm";
import SignUpLinks from "@/components/common/userspage/signuppage/SignInLink";
import SocialLoginButtons from "@/components/common/userspage/SocialLoginButtons";

const DEFAULT_PROFILE_IMAGE_URL = "/assets/images/profile_ex.png";

const supabase = createClient();

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState(DEFAULT_PROFILE_IMAGE_URL);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useUserStore();

  const handleImageClick = () => document.getElementById("profileImageInput")?.click();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfileImage(file);

      const reader = new FileReader();
      reader.onloadend = () => setProfileImageUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSignUp = async () => {
    if (!nickname) return setError("닉네임을 입력해 주세요.");
    if (!email) return setError("이메일을 입력해 주세요.");
    if (!validateEmail(email)) return setError("유효한 이메일 주소를 입력해 주세요.");
    if (password.length < 6) return setError("비밀번호는 6자 이상이어야 합니다.");
    if (password !== confirmPassword) return setError("비밀번호가 일치하지 않습니다.");

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) return setError(`회원가입 실패: ${signUpError.message}`);

    if (signUpData?.user) {
      let profileImagePath = "";

      if (profileImage) {
        const filePath = `${signUpData.user.id}`;

        const { error: uploadError } = await supabase.storage.from("profiles").upload(filePath, profileImage);
        if (uploadError) return setError(`프로필 이미지 업로드 실패: ${uploadError.message}`);

        const { data: urlData } = supabase.storage.from("profiles").getPublicUrl(filePath);
        profileImagePath = urlData?.publicUrl || "";
      }

      const { error: insertError } = await supabase.from("Users").insert([
        {
          id: signUpData.user.id,
          created_at: new Date().toISOString(),
          user_nickname: nickname,
          profile_url: profileImagePath || DEFAULT_PROFILE_IMAGE_URL,
          user_email: email,
        },
      ]);

      if (insertError) return setError(`사용자 정보 저장 실패: ${insertError.message}`);

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) return setError(`자동 로그인 실패: ${signInError.message}`);

      if (signInData.session) {
        setUser(signUpData.user.id, email, nickname, profileImagePath || DEFAULT_PROFILE_IMAGE_URL);
      }

      queryClient.invalidateQueries({ queryKey: ["session"], exact: true });
      router.push("/");
    }
  };

  return (
    <div
      className="relative items-center w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/assets/images/backgrounds/backgrounds.png)" }}
    >
      <div className="flex items-center justify-center pt-10">
        <div className="bg-white p-8 rounded-[40px] border border-gray-300 w-[503px] h-[840px] flex flex-col">
          <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>
          <div className="space-y-4 w-[401px] mx-auto h-[740px] flex flex-col">
            <ProfileImage
              profileImageUrl={profileImageUrl}
              onImageClick={handleImageClick}
              onFileChange={handleFileChange}
            />
            <SignUpForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              nickname={nickname}
              setNickname={setNickname}
              error={error}
              handleSignUp={handleSignUp}
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="text-gray-500 mx-4">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            <SocialLoginButtons />
            <SignUpLinks />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
