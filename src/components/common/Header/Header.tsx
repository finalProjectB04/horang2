"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSessionData, logoutUser } from "@/utils/auth";
import Logo from "./Logo";
import Nav from "./Nav";
import AuthButtons from "./AuthButtons";
import { useUserStore } from "@/zustand/userStore";
import { Session } from "@supabase/supabase-js";

const Header = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const userId = useUserStore((state) => state.id);

  const { data: session } = useQuery<Session | null>({
    queryKey: ["session"],
    queryFn: fetchSessionData,
    initialData: () => null,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const { mutate: handleLogout } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/");
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });

  return (
    <header className="fixed top-0 w-full left-0 z-50 bg-gray-800 text-white h-[84px] bg-[url('/assets/images/header/header.png')] bg-cover bg-center">
      <div className="container mx-auto max-w-[1440px] flex items-center h-full px-4">
        <Logo />
        <Nav />
        <AuthButtons userId={userId} handleLogout={handleLogout} />
      </div>
    </header>
  );
};

export default Header;
