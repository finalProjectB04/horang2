import { supabase } from "@/utils/supabase/client";

export interface User {
  id: string;
  profile_url: string;
  user_nickname: string;
  user_email: string;
}

// fetchUserData.ts 파일 혹은 적절한 위치에
export const fetchUserData = async (email: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from("Users")
      .select("id, profile_url, user_nickname, user_email")
      .eq("user_email", email) // user_email 컬럼을 기준으로 검색
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return null;
    }

    if (!data) {
      console.error("No user data found");
      return null;
    }

    return {
      id: data.id,
      profile_url: data.profile_url,
      user_nickname: data.user_nickname,
      user_email: data.user_email,
    };
  } catch (error) {
    console.error("Error in fetchUserData function:", error);
    throw error;
  }
};
