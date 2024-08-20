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
        <ul className="grid grid-cols-2 gap-10 sm:gap-6 text-[14px] text-primary-500">
          {data.map((item, index) => (
            <li key={index} className="flex flex-col items-center justify-start space-y-3">
              <button
                onClick={() => router.push(`/detail/${item.contentid}`)}
                className="flex items-center justify-center w-36 h-36 sm:w-24 sm:h-24 rounded-full overflow-hidden"
              >
                {item?.firstimage ? (
                  <Image
                    src={item.firstimage}
                    alt={item.title}
                    width={120}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src="/assets/images/null_image.svg"
                    alt="No image available"
                    width={120}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
              <p
                className="text-center font-medium"
                style={{ maxWidth: "120px", whiteSpace: "normal", overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {item?.title}
              </p>
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
