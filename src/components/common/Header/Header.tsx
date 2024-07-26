"use client";

import { useRouter } from "next/navigation";
import { Session } from "@supabase/supabase-js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSessionData, logoutUser } from "@/utils/auth";
import Logo from "./Logo";
import Nav from "./Nav";
import AuthButtons from "./AuthButtons";

const Header = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: session, refetch } = useQuery<Session | null>({
    queryKey: ["session"],
    queryFn: fetchSessionData,
    // initialData: () => {
    //   if (typeof window !== "undefined") {
    //     const session = localStorage.getItem("supabaseSession");
    //     return session ? JSON.parse(session) : null;
    //   }
    //   return null;
    // },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const { mutate: handleLogout } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      localStorage.removeItem("supabaseSession");
      router.push("/signin");
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });

  return (
    <header className="bg-gray-800 text-white h-[84px] bg-[url('/assets/images/header/header.png')] bg-cover bg-center">
      <div className="container mx-auto max-w-[1440px] flex items-center h-full px-4">
        <Logo />
        <Nav />
        <AuthButtons session={session} handleLogout={handleLogout} />
      </div>
    </header>
  );
};

export default Header;
