// components/posting/select/PostActions.ts

// @/components/posting/update/route.ts
import { supabase } from "@/utils/supabase/client";

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
  if (file !== undefined) updateData.file = file;
  if (category !== undefined) updateData.category = category;

  const { data, error } = await supabase.from("Post").update(updateData).eq("id", id).select();

  if (error) throw error;
  return data;
};
// export const fetchComments = async (postId: string) => {
//   const { data, error } = await supabase
//     .from("comments")
//     .select("*")
//     .eq("post_id", postId)
//     .order("created_at", { ascending: true });

//   if (error) throw error;
//   return data;
// };

// export const addComment = async ({ postId, content }: { postId: string; content: string }) => {
//   const { data, error } = await supabase
//     .from("comments")
//     .insert({ post_id: postId, content, user_id: "current_user_id" }); // Replace 'current_user_id' with actual user ID

//   if (error) throw error;
//   return data;
// };

// export const updateComment = async ({ id, content }: { id: string; content: string }) => {
//   const { data, error } = await supabase.from("comments").update({ content }).eq("id", id);

//   if (error) throw error;
//   return data;
// };

// export const deleteComment = async (id: string) => {
//   const { data, error } = await supabase.from("comments").delete().eq("id", id);

//   if (error) throw error;
//   return data;
// };
