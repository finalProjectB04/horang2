import { supabase } from "@/utils/supabase/client";
import { User } from "@/types/User.types";

// 사용자 데이터를 가져오는 함수
export const fetchUserData = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from("Users")
      .select("id, profile_url, user_nickname, user_email, created_at")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return null;
    }

    if (!data) {
      console.error("No user data found.");
      return null;
    }

    return data as User;
  } catch (error) {
    console.error("Error in fetchUserData function:", error);
    return null;
  }
};
