import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

interface InsertData {
  title: string;
  content: string;
  files: File[];
  userId: string;
  category: string;
  cost: string;
  departure: string;
  period: string;
  place: string;
}
export const insertCommunityData = async ({
  title,
  content,
  files,
  userId,
  category,
  cost,
  departure,
  period,
  place,
}: InsertData) => {
  let fileUrls: string[] = [];

  if (files && files.length > 0) {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage.from("community-files").upload(fileName, file);

      if (error) {
        console.error("파일 업로드 실패:", error);
        throw new Error(`파일 업로드 실패: ${error.message}`);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("community-files").getPublicUrl(fileName);

      return publicUrl;
    });

    fileUrls = await Promise.all(uploadPromises);
  }

  const { data, error } = await supabase.from("Post").insert({
    title,
    content,
    files: fileUrls.join(","),
    user_id: userId,
    category,
    cost,
    departure,
    period,
    place,
  });

  if (error) {
    console.error("데이터 넣기 실패:", error);
    throw new Error(`데이터 넣기 실패: ${error.message}`);
  }

  return data;
};
