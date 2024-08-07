"use client";
import { ContentItem } from "@/types/ContentItem.type";
import Image from "next/image";

const DetailPageImage: React.FC<{ contentItemData: ContentItem }> = ({ contentItemData }) => {
  return (
    <section className="tablet:w-full tablet:max-w-[1024px] tablet:mx-auto desktop:w-full desktop:max-w-[1440px] desktop:mx-auto">
      {contentItemData.data.firstimage && (
        <Image
          src={contentItemData.data.firstimage || "/assets/images/null_image.svg"}
          alt="First Image"
          width={1440}
          height={350}
          priority
          className="tablet:w-full tablet:h-auto desktop:w-full desktop:h-auto"
        />
      )}
    </section>
  );
};

export default DetailPageImage;
