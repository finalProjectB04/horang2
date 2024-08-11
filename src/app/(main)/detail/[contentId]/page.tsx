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
    <main className="sm:max-w-[640px] md:max-w-[1024px] md:mx-auto md:grid md:justify-items-center lg:max-w-[1440px] lg:mx-auto lg:grid lg:justify-items-center">
      <DetailPageImage contentItemData={contentItemData} />
      <section
        className="flex justify-between items-center w-full max-w-[1440px] lg:pt-[140px] md:flex md:items-center md:justify-between md:w-full md:max-w-[1024px] md:mt-8
      sm:px-[24px] sm:pt-[46px] sm:pb-[17px]"
      >
        <div className="text-left md:flex-grow">
          <div className="lg:text-[38px] lg:font-bold md:text-[30px] md:font-semibold sm:text-[14px] sm:font-bold">
            {title}
          </div>
        </div>
        <div className="flex justify-center space-x-2 md:mt-0">
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
              className="md:w-12 md:h-12 sm:w-[20px] sm:h-[20px]"
            />
          </button>
          <ShareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
      </section>
      <section className="md:w-full md:max-w-[1024px] md:mt-4 lg:w-full lg:max-w-[1440px] lg:mt-4 lg:pb-[88px] sm:w-[640px] sm:px-[24px] sm:">
        <ContentDetail title={title || ""} addr1={addr1 || ""} tel={tel || ""} homepageLink={homepageLink} />
      </section>
      {contentItemData.data.overview && <ContentOverview overview={overview || ""} />}
      <section className="md:w-full md:flex md:justify-center md:mb-12 lg:w-full lg:flex lg:justify-center lg:mb-15 sm:max-w-[640px] sm-max-h-[290px]">
        <KakaoMap mapx={parseFloat(mapx || "0")} mapy={parseFloat(mapy || "0")} />
      </section>
      <section className="md:w-full md:max-w-[1024px] md:mt-12 md:pt-12 lg:w-full lg:max-w-[1440px] lg:mt-20 lg:pt-[200px] sm:max-w-[640px]">
        <div className="lg:pt-[33px] md:pt-[33px]">
          <DetailPageAddComment contentId={contentId} contenTypeId={contentTypeId || ""} />
        </div>
        <div className="lg:pt-[33px] md:pt-[33px]">
          <DetailPageCommentList contentId={contentId} />
        </div>
      </section>
      <FloatingButton />
    </main>
  );
};

export default DetailPage;
