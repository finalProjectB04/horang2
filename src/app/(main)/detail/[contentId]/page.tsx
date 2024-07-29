"use client";

import { Loading } from "@/components/common/Loading";
import ContentDetail from "@/components/detailpage/ContentDetail";
import ContentOverview from "@/components/detailpage/ContentOverview";
import DetailPageAddComment from "@/components/detailpage/DetailPageAddComment";
import DetailPageCommentList from "@/components/detailpage/DetailPageCommentList";
import DetailPageLikeButton from "@/components/detailpage/DetailPageLikeButton";
import DetailPageSwiper from "@/components/detailpage/DetailPageSwiper";
import KakaoMap from "@/components/detailpage/KakaoMap";
import KakaoShareButton from "@/components/detailpage/KakaoShareButton";
import LinkUrlButton from "@/components/detailpage/LinkUrlButton";
import { useContentId } from "@/hooks/detailpage/useContentId";
import { useContentItem } from "@/hooks/detailpage/useContentItem";
import { useSessionData } from "@/hooks/detailpage/useSessionData";
import { parseHTMLString } from "../../../../utils/detailpage/StringUtils";

const DetailPage = () => {
  const contentId = useContentId();

  const { data: session } = useSessionData();

  const { data: contentItemData, isPending: pendingContentItem, error: contentItemError } = useContentItem(contentId);

  if (pendingContentItem) {
    return <Loading />;
  }

  if (contentItemError) {
    return <h1>에러가 발생했습니다: {contentItemError.message}</h1>;
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
