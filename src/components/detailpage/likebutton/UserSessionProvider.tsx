"use client";

import { createClient } from "@/utils/supabase/client";
import React, { createContext, useContext, useEffect, useState } from "react";

const supabase = createClient();

interface UserSessionContextProps {
  userId: string | null;
  ensureUserExists: (userId: string) => Promise<void>;
}

const UserSessionContext = createContext<UserSessionContextProps | undefined>(undefined);

export const UserSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      } else if (session) {
        setUserId(session.user.id);
        await ensureUserExists(session.user.id);
      }
    };
    fetchSession();
  }, []);

  const ensureUserExists = async (userId: string) => {
    const { data: user, error } = await supabase.from("Users").select("id").eq("id", userId).single();
    if (error && error.code === "PGRST116") {
      const { error: insertError } = await supabase.from("Users").insert([{ id: userId }]);
      if (insertError) {
        console.error("유저정보(소셜로그인 사용자 데이터 like 테이블 입력) 입력실패:", insertError);
      }
    } else if (error) {
      console.error("유저 정보 가져오기 오류", error);
    }
  };

  return <UserSessionContext.Provider value={{ userId, ensureUserExists }}>{children}</UserSessionContext.Provider>;
};

export const useUserSession = (): UserSessionContextProps => {
  const context = useContext(UserSessionContext);
  if (!context) {
    throw new Error("useUserSession must be used within a UserSessionProvider");
  }
  return context;
};
