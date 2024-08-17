"use client";

import LoadingPage from "@/app/loading";
import ContentDetail from "@/components/detailpage/ContentDetail";
import ContentOverview from "@/components/detailpage/ContentOverview";
import DetailPageAddComment from "@/components/detailpage/DetailPageAddComment";
import DetailPageCommentList from "@/components/detailpage/DetailPageCommentList";
import DetailPageLikeButton from "@/components/detailpage/DetailPageLikeButton";
import DetailPageImage from "@/components/detailpage/DetailPageSwiper";
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

  if (!contentItemData || !contentItemData.data) {
    return <div>데이터가 없거나 api 서버와 연결 할 수 없습니다</div>;
  }

  return (
    <main className="sm:w-full sm:max-w-full sm:mx-auto  md:max-w-[910px] md:mx-auto md:grid md:justify-items-center lg:max-w-[960px] lg:mx-auto lg:grid lg:justify-items-center">
      <DetailPageImage contentItemData={contentItemData} />

      <section className="flex justify-between items-center w-full lg:max-w-[1280px] lg:pt-[80px] md:flex md:items-center md:justify-between md:w-full md:max-w-[910px] md:mt-8 md:px-[32px] sm:px-[24px] sm:pt-[46px] sm:pb-[17px]">
        <div className="text-left md:flex-grow">
          <div className="lg:text-[19px] lg:font-bold md:text-[17px] md:font-semibold sm:text-[14px] sm:font-bold">
            {title}
          </div>
        </div>
        <div className="flex justify-center space-x-4">
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
              width={32}
              height={32}
              className="sm:w-[24px] sm:h-[24px] md:w-[28px] md:h-[28px]lg:mb-2"
            />
          </button>
          <div>
            <ShareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      </section>

      <section className="md:w-full  md:max-w-[910px] md:mt-4 md:px-[24px] lg:w-full lg:max-w-[1280px] lg:mt-4 sm:w-full sm:px-[24px]">
        <ContentDetail
          title={title || ""}
          addr1={addr1 || ""}
          tel={tel || ""}
          homepageLink={homepageLink}
          contenttypeid={contentTypeId || ""}
        />
      </section>

      {contentItemData.data.overview && (
        <div className="md:px-[32px]">
          <ContentOverview overview={overview || ""} />
        </div>
      )}

      <section className="md:w-full md:flex md:justify-center md:mb-12 lg:w-full lg:flex lg:justify-center sm:max-w-full sm-max-h-[290px]">
        <KakaoMap mapx={parseFloat(mapx || "0")} mapy={parseFloat(mapy || "0")} />
      </section>

      <section className="md:w-full  md:max-w-[910px]  md:pt-6 md:px-[24px] lg:w-full lg:max-w-[1280px] lg:pt-[128px] sm:max-w-full">
        <div className="lg:pt-[16px] md:pt-[16px]">
          <DetailPageAddComment contentId={contentId} contentTypeId={contentTypeId || ""} />
        </div>
        <div className="lg:pt-[16px] md:pt-[16px]">
          <DetailPageCommentList contentId={contentId} />
        </div>
      </section>
    </main>
  );
};

export default DetailPage;
