"use client";

import ContentDetail from "@/components/detailpage/ContentDetail";
import ContentOverview from "@/components/detailpage/ContentOverview";
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
import { useParams } from "next/navigation";

import { parseHTMLString } from "./../../../../utils/detailpage/StringUtils";

const DetailPage = () => {
  const params = useParams();
  let contentId = params.contentId;

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

  const homepageLink = contentItemData?.data?.homepage ? parseHTMLString(contentItemData.data.homepage) : null;

  return (
    <main className="max-w-[1440px] mx-auto grid justify-items-center">
      <DetailPageSwiper contentItemData={contentItemData} />
      <section className="flex justify-between items-center w-full max-w-[1440px] mt-4">
        <div className="text-left">
          <div className="text-4xl font-bold">{contentItemData?.data?.title}</div>
        </div>
        <div className="flex space-x-2">
          <LinkUrlButton />
          <KakaoShareButton id={contentId} />
          <DetailPageLikeButton
            contentId={contentId}
            imageUrl={contentItemData?.data?.firstimage || ""}
            title={contentItemData?.data?.title}
            contentTypeId={contentItemData?.data?.contenttypeid}
            addr1={contentItemData?.data?.addr1 || ""}
            tel={contentItemData?.data?.tel || ""}
          />
        </div>
      </section>
      <section className="w-full max-w-[1440px] mt-4">
        <ContentDetail
          title={contentItemData?.data?.title || ""}
          addr1={contentItemData?.data?.addr1 || ""}
          tel={contentItemData?.data?.tel || ""}
          homepageLink={homepageLink}
        />
      </section>
      {contentItemData?.data?.overview && <ContentOverview overview={contentItemData.data.overview} />}
      <section className="w-full [1440px] flex justify-center mt-4 py-10">
        <KakaoMap
          mapx={parseFloat(contentItemData?.data?.mapx || "0")}
          mapy={parseFloat(contentItemData?.data?.mapy || "0")}
        />
      </section>
      <section className="w-full max-w-[1440px] mt-4 py-10">
        <DetailPageAddComment
          userId={session?.user?.id || null}
          contentId={contentId}
          contenTypeId={contentItemData?.data?.contenttypeid}
          userEmail={session?.user?.email || ""}
        />
        <DetailPageCommentList contentId={contentId} />
      </section>
    </main>
  );
};

export default DetailPage;
