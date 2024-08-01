import { createClient } from "@/utils/supabase/client";
const supabase = createClient();
export const deletePost = async (id: string) => {
  const { data, error } = await supabase.from("Post").delete().eq("id", id);

  if (error) throw error;
  return data;
};
