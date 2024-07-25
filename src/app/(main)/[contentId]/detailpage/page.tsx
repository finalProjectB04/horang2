"use client";

import { ContentItem } from "@/types/ContentItem.type";
import { fetchSessionData } from "@/utils/fetchSession";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import DetailPageAddPost from "./_components/DetailPageAddPost";
import LikeBtn from "./_components/DetailPageLikeButton";
import KakaoMap from "./_components/KakaoMap";
import KakaoShareButton from "./_components/KakaoShareButton";
import LinkUrlButton from "./_components/LinkUrlButton";

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
    console.log("🚀 ~ DetailPage ~ contentId:", contentId);
  }

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  const {
    data: session,
    isLoading: sessionLoading,
    error: sessionError,
  } = useQuery({
    queryKey: ["session"],
    queryFn: fetchSessionData,
  });

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

  const homepageLink = contentItemData.data.homepage ? parseHTMLString(contentItemData.data.homepage) : null;
  //홈페이지 링크 때문에 추가된 파트
  //homepage 호출값이 있으면 parseHTMLString 함수를 호출하고 그렇지 않으면 안쓰게 해서 에러안나게 처리
  return (
    <main className="max-w-[1440px] mx-auto grid justify-items-center">
      <section>
        {contentItemData.data.firstimage && (
          <Image src={contentItemData.data.firstimage} alt="First Image" width={720} height={350} priority />
        )}
      </section>
      <section className="flex justify-between items-center w-full max-w-[720px] mt-4">
        <div className="text-left">
          <div className="text-4xl font-bold">{contentItemData.data.title}</div>
        </div>
        <div className="flex space-x-2">
          <LinkUrlButton />
          <KakaoShareButton id={contentId} />
          <LikeBtn
            contentId={contentId}
            imageUrl={contentItemData.data.firstimage || ""}
            title={contentItemData.data.title}
            contentTypeId={contentItemData.data.contenttypeid}
            addr1={contentItemData.data.addr1 || ""}
            tel={contentItemData.data.tel || ""}
          />
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
        <section className="w-full max-w-[720px] mt-4 text-left py-10">
          <div>
            <h1 className="text-center text-3xl">overview:</h1>
            <div>
              {showMore ? (
                <p>{contentItemData.data.overview}</p>
              ) : (
                <p>{contentItemData.data.overview.substring(0, 100)}...</p>
              )}
            </div>
            {contentItemData.data.overview.length > 100 && (
              <div className="flex justify-center mt-2">
                <button onClick={handleShowMore} className="px-4 py-2 bg-slate-200 text-gray-950 rounded">
                  {showMore ? "접기" : "더보기"}
                </button>
              </div>
            )}
          </div>
        </section>
      )}
      <section className="w-full flex justify-center mt-4 py-10">
        <KakaoMap mapx={parseFloat(contentItemData.data.mapx)} mapy={parseFloat(contentItemData.data.mapy)} />
      </section>
      <section className="w-full max-w-[840px] mt-4 py-10">
        <DetailPageAddPost userId={session ? session.user.id : null} contentId={contentId} />
      </section>
    </main>
  );
};
export default DetailPage;
