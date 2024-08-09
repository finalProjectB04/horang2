"use client";
import { ContentItem } from "@/types/ContentItem.type";
import Image from "next/image";

const DetailPageImage: React.FC<{ contentItemData: ContentItem }> = ({ contentItemData }) => {
  return (
    <section className=" mobitle:max-w-[375px] tablet:w-full tablet:max-w-[1024px] tablet:mx-auto desktop:w-full desktop:max-w-[1440px] desktop:mx-auto">
      {contentItemData.data.firstimage && (
        <Image
          src={contentItemData.data.firstimage || "/assets/images/null_image.svg"}
          alt="First Image"
          width={1440}
          height={350}
          priority
          className="mobile:w-[375px] mobile:h-[528px] tablet:w-full tablet:h-auto desktop:w-full desktop:h-auto"
          sizes="(max-width: 640px) 375px, 1440px"
        />
      )}
    </section>
  );
};

export default DetailPageImage;
