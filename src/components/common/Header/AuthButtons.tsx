import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useUserStore } from "@/zustand/userStore";

const supabase = createClient();

const AuthButtons: React.FC = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { id, setUser, clearUser } = useUserStore((state) => ({
    id: state.id,
    setUser: state.setUser,
    clearUser: state.clearUser,
  }));

  useEffect(() => {
    const storedUser = Cookies.get("user-storage");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(
        userData.id,
        userData.user_email,
        userData.user_nickname,
        userData.profile_url,
        userData.provider,
        userData.provider_id,
      );
    } else {
      const checkSessionAndFetchUser = async () => {
        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData?.session?.user) {
          const { id } = sessionData.session.user;

          const { data: userData } = await supabase.from("Users").select("*").eq("id", id).maybeSingle();

          if (userData) {
            const { user_email = "", user_nickname = "", profile_url = "", provider = "", provider_id = "" } = userData;

            setUser(id, user_email || "", user_nickname || "", profile_url || "", provider || "", provider_id || "");
            Cookies.set("user-storage", JSON.stringify(userData), { expires: 7 });
          } else {
            clearUser();
          }
        } else {
          clearUser();
        }
      };

      checkSessionAndFetchUser();
    }

    setIsClient(true);
  }, [setUser, clearUser]);

  const onLogoutClick = async () => {
    if (!id) return;

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        Cookies.remove("user-storage");

        clearUser();

        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex-shrink-0 flex space-x-4 ml-4">
      {!id ? (
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
