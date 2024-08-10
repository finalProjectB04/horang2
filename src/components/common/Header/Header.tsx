"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUser } from "@/utils/auth";
import Logo from "./Logo";
import Nav from "./Nav";
import AuthButtons from "./AuthButtons";
import { useUserStore } from "@/zustand/userStore";

const Header = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { id: userId, clearUser } = useUserStore();

  const { mutate: handleLogout } = useMutation({
    mutationFn: async () => {
      await logoutUser();
      clearUser();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/");
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });

  return (
    <header className="sm:hidden md:block lg:block fixed top-0 w-full left-0 z-50 bg-secondary-800 text-white h-[84px] bg-[url('/assets/images/header/header.png')] bg-cover bg-center">
      <div className="container mx-auto max-w-[1440px] flex items-center h-full px-4">
        <Logo />
        <Nav />
        <AuthButtons userId={userId} handleLogout={handleLogout} />
      </div>
    </header>
  );
};

export default Header;
