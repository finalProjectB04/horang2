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
    <main className="tablet:max-w-[1024px] tablet:mx-auto tablet:grid tablet:justify-items-center desktop:max-w-[1440px] desktop:mx-auto desktop:grid desktop:justify-items-center">
      <DetailPageImage contentItemData={contentItemData} />
      <section className="flex justify-between items-center w-full max-w-[1440px] mt-12 py-20 tablet:flex tablet:items-center tablet:justify-between tablet:w-full tablet:max-w-[1024px] tablet:mt-8 tablet:py-10">
        <div className="text-left tablet:flex-grow">
          <div className="text-4xl font-bold tablet:text-3xl">{title}</div>
        </div>
        <div className="flex justify-center space-x-2 tablet:mt-0">
          <DetailPageLikeButton
            contentId={contentId}
            imageUrl={imageUrl || ""}
            title={title || ""}
            contentTypeId={contentTypeId || ""}
            addr1={addr1 || ""}
            tel={tel || ""}
          />
          <button onClick={() => setIsModalOpen(true)}>
            <Image
              src="/assets/images/shareModal.svg"
              alt="Custom Button Image"
              width={48}
              height={48}
              className="tablet:w-12 tablet:h-12"
            />
          </button>
          <ShareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
      </section>
      <section className="tablet:w-full tablet:max-w-[1024px] tablet:mt-4 desktop:w-full desktop:max-w-[1440px] desktop:mt-4">
        <ContentDetail title={title || ""} addr1={addr1 || ""} tel={tel || ""} homepageLink={homepageLink} />
      </section>
      {contentItemData.data.overview && <ContentOverview overview={overview || ""} />}
      <section className="tablet:w-full tablet:flex tablet:justify-center tablet:mb-12 desktop:w-full desktop:flex desktop:justify-center desktop:mb-15">
        <KakaoMap mapx={parseFloat(mapx || "0")} mapy={parseFloat(mapy || "0")} />
      </section>
      <section className="tablet:w-full tablet:max-w-[1024px] tablet:mt-12 tablet:pt-12 desktop:w-full desktop:max-w-[1440px] desktop:mt-20 desktop:pt-[181px]">
        <div className="desktop:pt-[33px] tablet:pt-[33px]">
          <DetailPageAddComment contentId={contentId} contenTypeId={contentTypeId || ""} />
        </div>
        <div className="desktop:pt-[33px] tablet:pt-[33px]">
          <DetailPageCommentList contentId={contentId} />
        </div>
      </section>
      <FloatingButton />
    </main>
  );
};

export default DetailPage;
