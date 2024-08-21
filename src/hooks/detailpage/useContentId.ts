"use client";

import { useParams } from "next/navigation";

export const useContentId = () => {
  const params = useParams();
  let contentId = params.contentId;

  if (Array.isArray(contentId)) {
    contentId = contentId[0];
  }

  if (contentId) {
    contentId = decodeURIComponent(contentId);
    contentId = contentId.replace(/^\[|\]$/g, "");
  }

  return contentId || "";
};
