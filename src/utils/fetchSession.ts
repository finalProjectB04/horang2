import { supabase } from "@/components/common/contexts/supabase.context";

export const fetchSessionData = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session;
};
