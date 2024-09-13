import { useContentId } from "@/hooks/detailpage/useContentId";
import { useContentItem } from "@/hooks/detailpage/useContentItem";

export const useContentData = () => {
  const contentId = useContentId();
  const { data: contentItemData, isPending, error } = useContentItem(contentId);

  return { contentId, contentItemData, isPending, error };
};
