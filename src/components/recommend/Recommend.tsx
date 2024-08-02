import { Item } from "@/types/APIResponse.type";
import Image from "next/image";
import React from "react";

interface RecommendProps {
  data: Item[];
  MBTIResult: string;
}

const Recommend: React.FC<RecommendProps> = ({ data, MBTIResult }) => {
  return (
    <div>
      {data.length > 0 ? (
        <ul className="grid grid-cols-3 gap-10">
          {data.map((item, index) => (
            <li key={index} className="flex flex-col items-center">
              <h2 className="text-center">{item.title}</h2>
              {item.firstimage ? (
                <Image src={item.firstimage} alt={item.title} width={400} height={400} className="object-contain" />
              ) : (
                <Image
                  src="/assets/images/null_image.svg"
                  alt="No image available"
                  width={400}
                  height={400}
                  className="object-contain"
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Recommend;
