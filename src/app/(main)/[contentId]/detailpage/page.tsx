"use client";

import { ContentItem } from "@/types/ContentItem.type";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

const DetailPage = () => {
  const params = useParams();
  let contentId = params.contentId;
  const [showMore, setShowMore] = useState(false);

  if (Array.isArray(contentId)) {
    contentId = contentId[0];
  }

  // URL 디코딩 및 대괄호 제거 --> 안해주면 특수문자뜸.
  if (contentId) {
    contentId = decodeURIComponent(contentId);
    contentId = contentId.replace(/^\[|\]$/g, "");
    console.log("🚀 ~ DetailPage ~ contentId:", contentId);
  }

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const {
    data: contentItemData,
    isPending,
    error,
  } = useQuery<ContentItem, Error>({
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

  if (isPending) {
    return <div>불러오는중...</div>;
  }

  if (error) {
    return <h1>에러가 발생했습니다: {error.message}</h1>;
  }
  console.log("🚀 ~ DetailPage ~ contentItemData:", contentItemData);

  return (
    <main className="max-w-[1440px] mx-auto grid justify-items-center">
      <section>
        {contentItemData.data.firstimage && (
          <Image src={contentItemData.data.firstimage} alt="First Image" width={720} height={350} />
        )}
      </section>
      <section className="flex justify-between items-center w-full max-w-[720px] mt-4">
        <div className="text-left">
          <div className="text-4xl font-bold">{contentItemData.data.title}</div>
        </div>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-slate-200 text-gray-950 rounded">링크</button>
          <button className="px-4 py-2 bg-slate-200 text-gray-950 rounded">좋아요</button>
        </div>
      </section>
      <section className="w-full max-w-[720px] mt-4">
        <div className="text-left">
          <div>
            <strong>장소명 :</strong> {contentItemData.data.telname}
          </div>
          <div>
            <strong>주소:</strong> {contentItemData.data.addr1}
          </div>
          <div>
            <strong>tel:</strong> {contentItemData.data.tel}
          </div>
          <div>
            <strong>homepage:</strong>
            {contentItemData.data.homepage && <p>{contentItemData.data.homepage}</p>}
          </div>
        </div>
      </section>
      {contentItemData.data.overview && (
        <section className="w-full max-w-[720px] mt-4 text-left">
          <div>
            <h1 className="text-center text-3xl">overview:</h1>
            <div>
              {showMore ? (
                <p>{contentItemData.data.overview}</p>
              ) : (
                <p>{contentItemData.data.overview.substring(0, 100)}...</p>
              )}
            </div>
            {contentItemData.data.overview.length > 200 && (
              <div className="flex justify-center mt-2">
                <button onClick={handleShowMore} className="px-4 py-2 bg-slate-200 text-gray-950 rounded">
                  {showMore ? "접기" : "더보기"}
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
};
export default DetailPage;
