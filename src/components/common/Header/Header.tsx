"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";

// Supabase 클라이언트 초기화
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const Header = () => {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  // 로그인 상태 확인
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    checkSession();
    // 로그인 상태를 체크하고 세션이 바뀔 때 업데이트
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login"); // 로그아웃 후 로그인 페이지로 리디렉션
  };

  return (
    <header className="bg-gray-800 text-white py-6">
      {/* 헤더 컨테이너 */}
      <div className="container mx-auto max-w-[1440px] flex items-center px-4">
        {/* 로고와 네비게이션을 포함하는 컨테이너 (왼쪽에 로고, 오른쪽에 네비게이션 및 버튼) */}
        <div className="flex-grow flex items-center">
          {/* 로고 (왼쪽에 배치) */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/images/logo.png" // 로고 이미지 경로
                alt="MyLogo" // 이미지 대체 텍스트
                width={100} // 이미지의 너비
                height={40} // 이미지의 높이
                className="cursor-pointer" // 마우스 커서를 포인터로 변경
              />
            </Link>
          </div>

          {/* 네비게이션 (오른쪽에 배치) */}
          <nav className="ml-auto flex items-center space-x-4">
            {/* 네비게이션 링크 */}
            <Link href="/travel-recommendations">
              <span className="hover:text-gray-400 cursor-pointer">여행지 추천</span>
            </Link>
            <Link href="/hot-places">
              <span className="hover:text-gray-400 cursor-pointer">내 근처 핫 플레이스</span>
            </Link>
            <Link href="/custom-itinerary">
              <span className="hover:text-gray-400 cursor-pointer">내 취향 코스 짜기</span>
            </Link>
            <Link href="/mypage">
              <span className="hover:text-gray-400 cursor-pointer">마이페이지</span>
            </Link>
          </nav>
        </div>

        {/* 로그인 및 회원가입 버튼 (오른쪽에 배치) */}
        <div className="flex-shrink-0 flex space-x-4 ml-4">
          {session ? (
            <span
              onClick={handleLogout}
              className="bg-[#222222] text-[#FF912B] border border-[#FF912B] px-4 py-2 rounded hover:bg-[#333333] cursor-pointer"
            >
              로그아웃
            </span>
          ) : (
            <>
              <Link href="/login">
                <span className="bg-[#222222] text-[#FF912B] border border-[#FF912B] px-4 py-2 rounded hover:bg-[#333333] cursor-pointer">
                  로그인
                </span>
              </Link>
              <Link href="/signup">
                <span className="bg-[#FF912B] text-[#222222] border border-[#FF912B] px-4 py-2 rounded hover:bg-[#FFAB80] cursor-pointer">
                  회원가입
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
