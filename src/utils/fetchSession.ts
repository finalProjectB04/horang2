// utils/fetchSessionData.ts
import { Session } from "@supabase/supabase-js";
import Cookies from "js-cookie";

export const fetchSessionData = async (): Promise<Session | null> => {
  const sessionCookie = Cookies.get("supabaseSession");
  if (sessionCookie) {
    try {
      return JSON.parse(sessionCookie) as Session;
    } catch (error) {
      console.error("Failed to parse session from cookie:", error);
      return null;
    }
  }

  // If no cookie is found, return null
  return null;
};
