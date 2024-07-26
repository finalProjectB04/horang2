import { supabase } from "./supabase/client";

export const fetchSessionData = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};
