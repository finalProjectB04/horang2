import { supabase } from "@/utils/supabase/client";

interface InsertData {
  title: string;
  content: string;
  files: File | null;
  userId: string;
  category: string; // 카테고리 필드 추가
}

export const insertCommunityData = async ({ title, content, files, userId, category }: InsertData) => {
  let fileUrl = "";

  if (files) {
    const fileExt = files.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data, error } = await supabase.storage.from("community-files").upload(fileName, files);

    if (error) {
      console.error("파일 업로드를 못했어요:", error);
      throw new Error(`파일 업로드를 못했어요: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("community-files").getPublicUrl(fileName);
    fileUrl = publicUrl;
  }

  const { data, error } = await supabase.from("Post").insert({
    title,
    content,
    files: fileUrl,
    user_id: userId,
    category,
  });

  if (error) {
    console.error("데이터 넣기 실패:", error);
    throw new Error(`데이터 넣기 실패: ${error.message}`);
  }

  return data;
};
