import { Item } from "@/types/APIResponse.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface RecommendProps {
  data: Item[];
  MBTIResult: string;
}

const Recommend: React.FC<RecommendProps> = ({ data, MBTIResult }) => {
  const router = useRouter();
  return (
    <div className="flex justify-center">
      {data.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[18px] text-grey-600 font-normal">
          {data.map((item, index) => (
            <li key={index} className="flex flex-col items-center space-y-2">
              <h2 className="text-center">{item.title}</h2>
              <button onClick={() => router.push(`/detail/${item.contentid}`)}>
                {item.firstimage ? (
                  <Image src={item.firstimage} alt={item.title} width={100} height={100} className="object-contain" />
                ) : (
                  <Image
                    src="/assets/images/null_image.svg"
                    alt="No image available"
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>정보가 없습니다</p>
      )}
    </div>
  );
};

export default Recommend;
