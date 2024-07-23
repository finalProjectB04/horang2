"use client";

import { useRouter } from "next/navigation";
import { createClient, Session } from "@supabase/supabase-js";
import Link from "next/link";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Supabase 클라이언트 초기화
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// 세션 데이터를 가져오는 쿼리 함수
const fetchSessionData = async (): Promise<Session | null> => {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Failed to fetch session:", error);
    return null;
  }
  return data.session;
};

// 로그아웃을 처리하는 뮤테이션 함수
const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Failed to sign out:", error);
    throw new Error("Failed to sign out");
  }
  localStorage.removeItem("supabaseSession");
};

const Header = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 세션 데이터를 가져오는 쿼리
  const { data: session, refetch } = useQuery<Session | null>({
    queryKey: ["session"],
    queryFn: fetchSessionData,
    initialData: () => {
      if (typeof window !== "undefined") {
        const session = localStorage.getItem("supabaseSession");
        return session ? JSON.parse(session) : null;
      }
      return null;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // 로그아웃 처리를 위한 뮤테이션
  const { mutate: handleLogout } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      localStorage.removeItem("supabaseSession"); // localStorage에서도 세션 삭제
      router.push("/signin");
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });

  // 세션 데이터가 업데이트되면 refetch 호출
  if (!session) {
    refetch();
  }

  return (
    <header className="bg-gray-800 text-white py-4">
      <div className="container mx-auto max-w-[1440px] flex items-center px-4">
        <div className="flex-grow flex items-center">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image src="/assets/images/logo.svg" alt="MyLogo" width={140} height={40} className="cursor-pointer" />
            </Link>
          </div>
          <nav className="ml-auto flex items-center space-x-4">
            <Link href="/travel-recommendations">
              <span className="hover:text-gray-400 cursor-pointer">여행지 추천</span>
            </Link>
            <Link href="/location">
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
          {!session ? (
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
          ) : (
            <span
              onClick={() => handleLogout()}
              className="bg-[#222222] text-[#FF912B] border border-[#FF912B] px-4 py-2 rounded hover:bg-[#333333] cursor-pointer"
            >
              로그아웃
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
