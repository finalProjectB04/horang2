import { createClient } from "@/utils/supabase/client";
const supabase = createClient();

interface UpdateType {
  id: string;
  content?: string | null;
  title?: string | null;
  files?: (File | string)[] | null;
  category?: string | null;
  cost?: string | null;
  departure?: string | null;
  period?: string | null;
  place?: string | null;
}

export const updatePost = async ({
  id,
  content,
  title,
  files,
  category,
  cost,
  departure,
  period,
  place,
}: UpdateType) => {
  const updateData: { [key: string]: any } = {};

  if (content !== undefined) updateData.content = content;
  if (title !== undefined) updateData.title = title;
  if (category !== undefined) updateData.category = category;
  if (cost !== undefined) updateData.cost = cost;
  if (departure !== undefined) updateData.departure = departure;
  if (period !== undefined) updateData.period = period;
  if (place !== undefined) updateData.place = place;

  // Handle file uploads
  if (files && files.length > 0) {
    const fileUrls: string[] = [];

    for (const file of files) {
      if (typeof file === "string") {
        fileUrls.push(file);
      } else {
        // 실제로는 supabase 스토리지에 파일을 업로드하고 해당 URL을 받아야 함
        const { data: fileData, error: uploadError } = await supabase.storage
          .from("Post") // 버킷 이름을 올바르게 설정
          .upload(`public/${Date.now()}_${file.name}`, file);

        if (uploadError) throw uploadError;

        // 파일의 Public URL 생성
        const { data: publicUrlData } = supabase.storage.from("Post").getPublicUrl(fileData.path);

        if (!publicUrlData.publicUrl) {
          throw new Error("Public URL 생성 실패");
        }

        fileUrls.push(publicUrlData.publicUrl); // Public URL을 저장
      }
    }

    updateData.files = fileUrls.join(",");
  }

  const { data, error } = await supabase.from("Post").update(updateData).eq("id", id).select();

  if (error) throw error;
  return data;
};
