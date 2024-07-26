"use client";

import DetailPageAddComment from "@/components/detailpage/DetailPageAddComment";
import DetailPageCommentList from "@/components/detailpage/DetailPageCommentList";
import DetailPageLikeButton from "@/components/detailpage/DetailPageLikeButton";
import DetailPageSwiper from "@/components/detailpage/DetailPageSwiper";
import KakaoMap from "@/components/detailpage/KakaoMap";
import KakaoShareButton from "@/components/detailpage/KakaoShareButton";
import LinkUrlButton from "@/components/detailpage/LinkUrlButton";
import { ContentItem } from "@/types/ContentItem.type";
import { fetchSessionData } from "@/utils/fetchSession";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";

const parseHTMLString = (htmlString: string): string | null => {
  //홈페이지 링크 때문에 추가된 파트
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const anchor = doc.querySelector("a");
  return anchor ? anchor.href : null;
};

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
  }

  const splitText = (text: string, chunkSize: number) => {
    const regex = new RegExp(`(.{1,${chunkSize}})`, "g");
    const matched = text.match(regex);
    return matched ? matched.join("\n") : "";
  };

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const {
    data: session,
    isPending: sessionLoading,
    error: sessionError,
  } = useQuery({
    queryKey: ["session"],
    queryFn: fetchSessionData,
  });

  const {
    data: contentItemData,
    isPending: pendingContentItem,
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

  if (pendingContentItem) {
    return <div>불러오는중...</div>;
  }

  if (error) {
    return <h1>에러가 발생했습니다: {error.message}</h1>;
  }

  const homepageLink = contentItemData.data.homepage ? parseHTMLString(contentItemData.data.homepage) : null;
  const formattedOverview = contentItemData.data.overview ? splitText(contentItemData.data.overview, 60) : "";

  return (
    <main className="max-w-[1440px] mx-auto grid justify-items-center">
      <DetailPageSwiper contentItemData={contentItemData} />
      <section className="flex justify-between items-center w-full max-w-[1440px] mt-4">
        <div className="text-left">
          <div className="text-4xl font-bold">{contentItemData.data.title}</div>
        </div>
        <div className="flex space-x-2">
          <LinkUrlButton />
          <KakaoShareButton id={contentId} />
          <DetailPageLikeButton
            contentId={contentId}
            imageUrl={contentItemData.data.firstimage || ""}
            title={contentItemData.data.title}
            contentTypeId={contentItemData.data.contenttypeid}
            addr1={contentItemData.data.addr1 || ""}
            tel={contentItemData.data.tel || ""}
          />
        </div>
      </section>
      <section className="w-full max-w-[1440px] mt-4">
        <div className="text-left">
          <div className="flex item-center gap-6 py-2">
            <Image src="/assets/images/smallMaker.png" alt="장소명" width={10} height={10} />
            <strong>장소명 :</strong> {contentItemData.data.title}
          </div>
          <div className="flex item-center gap-6 py-2">
            <Image src="/assets/images/smallMaker.png" alt="주소" width={10} height={10} />
            <strong>주소:</strong> {contentItemData.data.addr1}
          </div>
          <div className="flex item-center gap-6 py-2">
            <Image src="/assets/images/smallMaker.png" alt="tel" width={10} height={10} />
            <strong>tel:</strong> {contentItemData.data.tel}
          </div>
          <div className="flex item-center gap-6 py-2">
            <Image src="/assets/images/smallMaker.png" alt="homepage" width={10} height={10} />
            <strong>homepage: </strong>
            {homepageLink && (
              <a href={homepageLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                {homepageLink}
              </a>
            )}
          </div>
        </div>
      </section>
      {contentItemData.data.overview && (
        <section className="w-full max-w-[1440px] mt-4 text-left py-10">
          <div className="text-start">
            <h1 className="text-3xl font-bold py-5">overview:</h1>
            <div style={{ whiteSpace: "pre-wrap" }}>
              {showMore ? <p>{formattedOverview}</p> : <p>{formattedOverview.substring(0, 200)}...</p>}
            </div>
            {contentItemData.data.overview.length > 100 && (
              <div className="flex justify-center mt-2">
                <button
                  onClick={handleShowMore}
                  className="px-9 py-3 text-orange-600 font-bold bg-white rounded-lg border border-orange-300"
                >
                  {showMore ? "접기" : "더보기"}
                </button>
              </div>
            )}
          </div>
        </section>
      )}
      <section className="w-full [1440px] flex justify-center mt-4 py-10">
        <KakaoMap mapx={parseFloat(contentItemData.data.mapx)} mapy={parseFloat(contentItemData.data.mapy)} />
      </section>
      <section className="w-full max-w-[1440px] mt-4 py-10">
        <DetailPageAddComment
          userId={session ? session.user.id : null}
          contentId={contentId}
          contenTypeId={contentItemData.data.contenttypeid}
          userEmail={session ? session.user.email : ""}
        />
        <DetailPageCommentList contentId={contentId} />
      </section>
    </main>
  );
};
export default DetailPage;
