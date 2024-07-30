import { supabase } from "@/utils/supabase/client";

interface InsertData {
  title: string;
  content: string;
  file: File | null;
  userId: string;
}

export const insertCommunityData = async ({ title, content, file, userId }: InsertData) => {
  let fileUrl = "";

  if (file) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { data, error } = await supabase.storage.from("community-files").upload(fileName, file);

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
    file: fileUrl,
    user_id: userId,
  });

  if (error) {
    console.error("데이터 넣기 실패:", error);
    throw new Error(`데이터 넣기 실패: ${error.message}`);
  }

  return data;
};
