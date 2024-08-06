import { Session } from "@supabase/supabase-js";
import Cookies from "js-cookie";
import { createClient } from "./supabase/client";

const supabase = createClient();

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

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Failed to fetch session:", error);
    return null;
  }
  return data.session;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Failed to sign out:", error);
    throw new Error("Failed to sign out");
  }
  Cookies.remove("supabaseSession");
};
