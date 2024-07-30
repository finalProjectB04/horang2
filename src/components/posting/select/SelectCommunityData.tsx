import { supabase } from "@/utils/supabase/client";

export const selectCommunityData = async () => {
  const { data, error } = await supabase.from("Post").select("*");
  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
};
