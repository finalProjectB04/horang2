"use client";

import LoadingPage from "@/app/loading";
import ContentDetail from "@/components/detailpage/ContentDetail";
import ContentOverview from "@/components/detailpage/ContentOverview";
import DetailPageAddComment from "@/components/detailpage/DetailPageAddComment";
import DetailPageCommentList from "@/components/detailpage/DetailPageCommentList";
import DetailPageLikeButton from "@/components/detailpage/DetailPageLikeButton";
import DetailPageImage from "@/components/detailpage/DetailPageSwiper";
import FloatingButton from "@/components/detailpage/FloatingButton";
import KakaoMap from "@/components/detailpage/KakaoMap";
import ShareModal from "@/components/detailpage/ShareModal";
import { useContentId } from "@/hooks/detailpage/useContentId";
import { useContentItem } from "@/hooks/detailpage/useContentItem";
import { parseHTMLString } from "@/utils/detailpage/StringUtils";
import Image from "next/image";
import { useState } from "react";

const DetailPage = () => {
  const contentId = useContentId();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: contentItemData, isPending: pendingContentItem, error: contentItemError } = useContentItem(contentId);
  const {
    firstimage: imageUrl,
    contenttypeid: contentTypeId,
    title,
    addr1,
    tel,
    homepage,
    overview,
    mapx,
    mapy,
  } = contentItemData?.data || {};

  const homepageLink = homepage ? parseHTMLString(homepage) : null;

  if (pendingContentItem) {
    return <LoadingPage />;
  }

  if (contentItemError) {
    return <h1>에러가 발생했습니다: {contentItemError.message}</h1>;
  }

  return (
    <main className="max-w-[1440px] mx-auto grid justify-items-center">
      <DetailPageImage contentItemData={contentItemData} />
      <section className="flex justify-between items-center w-full max-w-[1440px] mt-12 py-20">
        <div className="text-left">
          <div className="text-4xl font-bold">{title}</div>
        </div>
        <div className="flex justify-center space-x-2">
          <DetailPageLikeButton
            contentId={contentId}
            imageUrl={imageUrl || ""}
            title={title || ""}
            contentTypeId={contentTypeId || ""}
            addr1={addr1 || ""}
            tel={tel || ""}
          />
          <button onClick={() => setIsModalOpen(true)}>
            <Image src="/assets/images/shareModal.svg" alt="Custom Button Image" width={48} height={48} />
          </button>
          <ShareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
      </section>
      <section className="w-full max-w-[1440px] mt-4">
        <ContentDetail title={title || ""} addr1={addr1 || ""} tel={tel || ""} homepageLink={homepageLink} />
      </section>
      {contentItemData?.data?.overview && <ContentOverview overview={overview || ""} />}
      <section className="w-full [1440px] flex justify-center mb-15">
        <KakaoMap mapx={parseFloat(mapx || "0")} mapy={parseFloat(mapy || "0")} />
      </section>
      <section className="w-full max-w-[1440px] mt-20 pt-20">
        <DetailPageAddComment contentId={contentId} contenTypeId={contentTypeId || ""} />
        <DetailPageCommentList contentId={contentId} />
      </section>
      <FloatingButton />
    </main>
  );
};

export default DetailPage;
