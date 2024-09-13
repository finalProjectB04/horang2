"use client";
import { ContentItem } from "@/types/ContentItem.type";
import Image from "next/image";
import React from "react";

const DetailPageImage: React.FC<{ contentItemData: ContentItem }> = React.memo(({ contentItemData }) => {
  const imageSrc = contentItemData?.data?.firstimage || "/assets/images/null_image.svg";

  return (
    <section className="sm:w-full sm:max-w-[375px] sm:mx-auto md:w-full md:max-w-[1024px] md:mx-auto lg:w-full lg:max-w-[1280px] lg:mx-auto">
      <Image
        src={imageSrc}
        alt="First Image"
        width={960}
        height={500}
        priority
        className="w-full h-auto mx-auto lg:max-w-[960px]"
        sizes="(max-width: 640px) 375px, (max-width: 1280px) 960px"
      />
    </section>
  );
});

DetailPageImage.displayName = "DetailPageImage";

export default DetailPageImage;
