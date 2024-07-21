"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, Session } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";

// Supabase 클라이언트 초기화
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const Header = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [showLogout, setShowLogout] = useState(false); // 로그아웃 버튼 표시 여부 상태
  const router = useRouter();

  useEffect(() => {
    // 세션 확인 및 업데이트
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        localStorage.setItem("supabaseSession", JSON.stringify(data.session));
      } else {
        setSession(null);
        localStorage.removeItem("supabaseSession");
      }
    };

    checkSession();

    // 세션 상태 변경을 감지
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setSession(null);
        setShowLogout(false); // 로그아웃 버튼 비활성화
        localStorage.removeItem("supabaseSession");
        localStorage.removeItem("loginSuccess"); // 로그인 성공 플래그 제거
      } else {
        setSession(session);
        setShowLogout(localStorage.getItem("loginSuccess") === "true"); // 로그인 성공 시만 로그아웃 버튼 표시
        localStorage.setItem("supabaseSession", JSON.stringify(session));
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("supabaseSession");
    localStorage.removeItem("loginSuccess"); // 로그아웃 시 로그인 성공 플래그 제거
    setSession(null);
    setShowLogout(false); // 로그아웃 버튼 비활성화
    router.push("/signin");
  };

  return (
    <header className="bg-gray-800 text-white py-6">
      <div className="container mx-auto max-w-[1440px] flex items-center px-4">
        <div className="flex-grow flex items-center">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image src="/images/logo.png" alt="MyLogo" width={100} height={40} className="cursor-pointer" />
            </Link>
          </div>
          <nav className="ml-auto flex items-center space-x-4">
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
        <div className="flex-shrink-0 flex space-x-4 ml-4">
          {showLogout ? (
            <span
              onClick={handleLogout}
              className="bg-[#222222] text-[#FF912B] border border-[#FF912B] px-4 py-2 rounded hover:bg-[#333333] cursor-pointer"
            >
              로그아웃
            </span>
          ) : (
            <>
              <Link href="/signin">
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
