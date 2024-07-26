import { Session } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AuthButtonsProps {
  session: Session | null;
  handleLogout: () => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ session, handleLogout }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set the mounted state to true when the component is mounted
    setMounted(true);
  }, []);

  // Render null if not mounted to prevent mismatches
  if (!mounted) return null;

  return (
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
  );
};

export default AuthButtons;
