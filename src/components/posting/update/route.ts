import { createClient } from "@/utils/supabase/client";
const supabase = createClient();
interface UpdateType {
  id: string;
  content?: string | null;
  title?: string | null;
  file?: string | null;
  category?: string | null;
}

export const updatePost = async ({ id, content, title, file, category }: UpdateType) => {
  const updateData: { [key: string]: any } = {};
  if (content !== undefined) updateData.content = content;
  if (title !== undefined) updateData.title = title;
  if (file !== undefined) updateData.files = file;
  if (category !== undefined) updateData.category = category;

  const { data, error } = await supabase.from("Post").update(updateData).eq("id", id).select();

  if (error) throw error;
  return data;
};
