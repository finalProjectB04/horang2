import { supabase } from "@/components/common/contexts/supabase.context";

export interface User {
  id: string;
  profile_url: string;
  user_nickname: string;
  user_address: string;
  user_email: string;
}

export const fetchUserData = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase.from("Users").select("*").eq("id", userId).single();

  if (error) {
    console.error("Error fetching user data:", error);
    return null;
  }

  return data as User;
};
