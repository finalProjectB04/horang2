"use client";
import { ContentItem } from "@/types/ContentItem.type";
import Image from "next/image";

const DetailPageImage: React.FC<{ contentItemData: ContentItem }> = ({ contentItemData }) => {
  return (
    <section className="sm:w-full sm:max-w-[375px] sm:mx-auto md:w-full md:max-w-[1024px] md:mx-auto lg:w-full lg:max-w-[1280px] lg:mx-auto">
      {contentItemData.data.firstimage && (
        <Image
          src={contentItemData.data.firstimage || "/assets/images/null_image.svg"}
          alt="First Image"
          width={960}
          height={500}
          priority
          className="w-full h-auto mx-auto lg:max-w-[960px]"
          sizes="(max-width: 640px) 375px, (max-width: 1280px) 960px"
        />
      )}
    </section>
  );
};

export default DetailPageImage;
