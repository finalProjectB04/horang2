"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { APIResponse, Item } from "@/types/APIResponse.type";
import Recommend from "./../../../../components/recommend/Recommend";

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
      let firstApiUrl = "";
      let secondApiUrl = "";
      let thirdApiUrl = "";
      let fourthApiUrl = "";
      let fifthApitUrl = "";

      if (MBTIResult === "1") {
        firstApiUrl =
          "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=28&areaCode=&sigunguCode=&cat1=A03&cat2=A0302&cat3=A03021000"; //카지노
        secondApiUrl =
          "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=28&areaCode=&sigunguCode=&cat1=A03&cat2=A0302&cat3=A03020800"; //경마
        thirdApiUrl =
          "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=28&areaCode=&sigunguCode=&cat1=A03&cat2=A0302&cat3=A03021100"; //승마?
        fourthApiUrl =
          "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&listYN=Y&arrange=A&contentTypeId=38&areaCode=&sigunguCode=&cat1=A04&cat2=A0401&cat3=A04010300"; //백화점?
        fifthApitUrl =
          "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=32&areaCode=39&sigunguCode=&cat1=B02&cat2=B0201&cat3=B02010100"; //제주 호텔
      } else {
        setError("Invalid MBTI Result");
        setLoading(false);
        return;
      }

      try {
        const [firstResponse, secondResponse, thirdReponse, fourthResponse, fifthResponse] = await axios.all([
          axios.get<APIResponse>(firstApiUrl, {
            params: {
              serviceKey: process.env.NEXT_PUBLIC_TOURIST_API_KEY,
              _type: "json",
              numOfRows: 500,
              pageNo: 1,
              MobileOS: "ETC",
              MobileApp: "AppTest",
            },
          }),
          axios.get<APIResponse>(secondApiUrl, {
            params: {
              serviceKey: process.env.NEXT_PUBLIC_TOURIST_API_KEY,
              _type: "json",
              numOfRows: 500,
              pageNo: 1,
              MobileOS: "ETC",
              MobileApp: "AppTest",
            },
          }),
          axios.get<APIResponse>(thirdApiUrl, {
            params: {
              serviceKey: process.env.NEXT_PUBLIC_TOURIST_API_KEY,
              _type: "json",
              numOfRows: 500,
              pageNo: 1,
              MobileOS: "ETC",
              MobileApp: "AppTest",
            },
          }),
          axios.get<APIResponse>(fourthApiUrl, {
            params: {
              serviceKey: process.env.NEXT_PUBLIC_TOURIST_API_KEY,
              _type: "json",
              numOfRows: 500,
              pageNo: 1,
              MobileOS: "ETC",
              MobileApp: "AppTest",
            },
          }),
          axios.get<APIResponse>(fifthApitUrl, {
            params: {
              serviceKey: process.env.NEXT_PUBLIC_TOURIST_API_KEY,
              _type: "json",
              numOfRows: 500,
              pageNo: 1,
              MobileOS: "ETC",
              MobileApp: "AppTest",
            },
          }),
        ]);

        const firstData = firstResponse.data.response.body.items.item || [];
        const secondData = secondResponse.data.response.body.items.item || [];
        const thirdData = thirdReponse.data.response.body.items.item || [];
        const fourthData = fourthResponse.data.response.body.items.item || [];
        const fifthData = fifthResponse.data.response.body.items.item || [];

        const combinedData: Item[] = [...firstData, ...secondData, ...thirdData, ...fourthData, ...fifthData];
        console.log("🚀 ~ fetchData ~ combinedData:", combinedData);

        const randomThreeItems = shuffleArray(combinedData).slice(0, 3);

        setData(randomThreeItems);
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
