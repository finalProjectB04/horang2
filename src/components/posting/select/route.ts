import { createClient } from "@/utils/supabase/client";
const supabase = createClient();
export const selectCommunityData = async () => {
  const { data, error } = await supabase.from("Post").select("*");
  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
};
export const selectPostById = async (id: string) => {
  const { data, error } = await supabase.from("Post").select("*").eq("id", id).single();

  if (error) {
    console.error("Error fetching post:", error);
    return null;
  }

  return data;
};
