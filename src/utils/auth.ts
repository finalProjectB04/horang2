import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase/client";

export const fetchSessionData = async (): Promise<Session | null> => {
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
  localStorage.removeItem("supabaseSession");
};
