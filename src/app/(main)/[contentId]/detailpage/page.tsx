"use client";

import { ContentItem } from "@/types/ContentItem.type";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const DetailPage = () => {
  const params = useParams();
  let contentId = params.contentId;

  // contentId가 배열인지 확인하고, 배열이면 첫 번째 요소를 사용
  if (Array.isArray(contentId)) {
    contentId = contentId[0];
  }

  // URL 디코딩 및 대괄호 제거
  if (contentId) {
    contentId = decodeURIComponent(contentId);
    contentId = contentId.replace(/^\[|\]$/g, "");
    console.log("🚀 ~ DetailPage ~ contentId:", contentId);
  }

  const {
    data: contentItemData,
    isPending,
    error,
  } = useQuery<ContentItem, Error>({
    queryKey: ["contentItem", contentId],
    queryFn: async () => {
      const response = await fetch(`/api/${contentId}/detailpage`);
      if (!response.ok) {
        throw new Error("데이터를 불러올 수 없습니다");
      }
      const data = await response.json();
      return data as ContentItem;
    },
    enabled: !!contentId,
  });

  if (isPending) {
    return <div>불러오는중...</div>;
  }

  if (error) {
    return <h1>에러가 발생했습니다: {error.message}</h1>;
  }

  return (
    <div>
      <h1>Detail Page for Content ID: {contentId}</h1>
      {contentItemData ? <pre>{JSON.stringify(contentItemData, null, 2)}</pre> : <p>No data found</p>}
    </div>
  );
};
export default DetailPage;

// "use client";

// import { getContentId } from "@/app/api/[contentId]/route";
// import { ContentItem } from "@/types/ContentItem.type";

// import { useQuery } from "@tanstack/react-query";

// const DetailPage = ({ params }: { params: { contentId: Promise<ContentItem> } }) => {
//   let contentId = params.contentId;

//   const {
//     data: ContentItemData,
//     isPending,
//     error,
//   } = useQuery<void, Error, void, (string | Promise<ContentItem>)[]>({
//     queryKey: ["contentItem", contentId],
//     queryFn: async () => {
//       const response = await getContentId(`api/${contentId}/detaipage`);
//       console.log("🚀 ~ queryFn: ~ getContentId:", getContentId);
//     },
//   });
//   if (isPending) {
//     return <div>불러오는중</div>;
//   }

//   if (error) {
//     return <h1>에러가 발생했습니다: {error.message}</h1>;
//   }

//   return <div>DetailPage</div>;
// };

// export default DetailPage;

// useEffect(() => {
//   const fetchData = async () => {
//     if (!contentId) return;
//     console.log(`Fetching data for contentId: ${contentId}`);
//     setIsLoading(true);
//     setError(null);
//     try {
//       const data = await getContentId(contentId as string);
//       console.log("API response data:", data);
//       if (data) {
//         setContentItemData(data);
//       } else {
//         setError("No data found");
//       }
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       setError("Error fetching data");
//     }
//     setIsLoading(false);
//   };

//   fetchData();
// }, [contentId]);

// if (isLoading) {
//   return <div>불러오는중</div>;
// }

// if (error) {
//   return <h1>에러가 발생했습니다: {error}</h1>;
// }

// const {
//   data: ContentItemData,
//   isPending,
//   error,
// } = useQuery<void, Error, void, (string | Promise<ContentItem>)[]>({
//   queryKey: ["contentItems", contentId],
//   queryFn: async () => {
//     const response = await getContentId(`api/${contentId}/detaipage`);
//   },
// });
// if (isPending) {
//   return <div>불러오는중</div>;
// }

// if (error) {
//   return <h1>에러가 발생했습니다: {error.message}</h1>;
// }
