import { supabase } from "@/utils/supabase/client";

export async function insertCommunityData({
  title,
  content,
  files,
  category,
  userId,
}: {
  title: string;
  content: string;
  files: File[];
  category: string;
  userId: string;
}) {
  try {
    // 파일 업로드
    const fileUrls = await Promise.all(
      files.map(async (file) => {
        const fileName = `${userId}/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from("community-files").upload(fileName, file);

        if (error) throw error;

        const { data: urlData } = supabase.storage.from("community-files").getPublicUrl(fileName);

        return urlData.publicUrl;
      }),
    );

    // 데이터 삽입
    const { data, error } = await supabase
      .from("Post")
      .insert({
        title,
        content,
        category,
        user_id: userId,
        image_urls: fileUrls,
      })
      .select();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error inserting community data:", error);
    throw error;
  }
}
