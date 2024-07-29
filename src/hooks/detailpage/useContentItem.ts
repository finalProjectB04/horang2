import { ContentItem } from "@/types/ContentItem.type";
import { useQuery } from "@tanstack/react-query";

export const useContentItem = (contentId: string) => {
  return useQuery<ContentItem, Error>({
    queryKey: ["contentItem", contentId],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/detailpage/${contentId}`);
      if (!response.ok) {
        throw new Error("데이터를 불러올 수 없습니다");
      }
      const data = await response.json();
      return data as ContentItem;
    },
    enabled: !!contentId,
  });
};
