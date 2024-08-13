import { useEffect, useState } from "react";
import { useUserStore } from "@/zustand/userStore";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

interface AuthButtonsProps {
  userId: string | null;
  handleLogout: () => Promise<void>;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ userId, handleLogout }) => {
  const [isClient, setIsClient] = useState(false);
  const { clearUser } = useUserStore((state) => ({
    clearUser: state.clearUser,
  }));

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onLogoutClick = async () => {
    if (!userId) return;

    try {
      await supabase.auth.signOut();
      await handleLogout();
      clearUser();
    } catch (error) {
      console.error("로그아웃 중 오류가 발생했습니다.", error);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex-shrink-0 flex space-x-4 ml-4">
      {!userId ? (
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
          onClick={onLogoutClick}
          className="bg-[#222222] text-[#FF912B] border border-[#FF912B] px-4 py-2 rounded hover:bg-[#333333] cursor-pointer"
        >
          로그아웃
        </span>
      )}
    </div>
  );
};

export default AuthButtons;
