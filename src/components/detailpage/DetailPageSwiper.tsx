"use client";
import { ContentItem } from "@/types/ContentItem.type";
import Image from "next/image";

const DetailPageImage: React.FC<{ contentItemData: ContentItem }> = ({ contentItemData }) => {
  return (
    <section className="sm:max-w-[375px] md:w-full md:max-w-[1024px] md:mx-auto lg:w-full lg:max-w-[1440px] lg:mx-auto">
      {contentItemData.data.firstimage && (
        <Image
          src={contentItemData.data.firstimage || "/assets/images/null_image.svg"}
          alt="First Image"
          width={1440}
          height={350}
          priority
          className="sm:w-[375px] sm:h-[528px] md:w-full md:h-auto lg:w-full lg:h-auto"
          sizes="(max-width: 640px) 375px, 1440px"
        />
      )}
    </section>
  );
};

export default DetailPageImage;
