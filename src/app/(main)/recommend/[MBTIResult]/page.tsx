"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { Item } from "@/types/APIResponse.type";
import Recommend from "../../../../components/recommend/Recommend";

interface RecommendPageProps {
  params: {
    MBTIResult: string;
  };
}

const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const RecommendPage: React.FC<RecommendPageProps> = ({ params }) => {
  const { MBTIResult } = params;
  const [data, setData] = useState<Item[]>([]);
  const decodedMBTIResult = decodeURIComponent(MBTIResult);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/recommend/${MBTIResult}`);
        const { firstData, secondData, thirdData, fourthData, fifthData } = response.data;

        const randomFirstData = shuffleArray(firstData).slice(0, 1);

        const remainingData = [...secondData, ...thirdData, ...fourthData, ...fifthData];
        const randomRemainingData = shuffleArray(remainingData)
          .filter((item) => !randomFirstData.some((selected) => selected.contentid === item.contentid))
          .slice(0, 2);

        const combinedData: Item[] = [...randomFirstData, ...randomRemainingData];
        console.log("🚀 ~ fetchData ~ combinedData:", combinedData);

        setData(combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      }

      setLoading(false);
    };

    fetchData();
  }, [MBTIResult]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return <Recommend data={data} MBTIResult={MBTIResult} />;
};

export default RecommendPage;
