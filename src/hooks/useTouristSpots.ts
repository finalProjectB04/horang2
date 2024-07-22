import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

export type TouristSpot = {
  title: string;
  mapx: number;
  mapy: number;
  address: string;
  contentid: string;
};

const fetchTouristSpots = async (latitude: number, longitude: number): Promise<TouristSpot[]> => {
  const response = await axios.get("http://apis.data.go.kr/B551011/KorService1/locationBasedList1", {
    params: {
      ServiceKey: process.env.NEXT_PUBLIC_TOURIST_API_KEY,
      contentTypeId: 12,
      numOfRows: 1000, // 전체 데이터 수
      pageNo: 1, // 첫 페이지
      MobileOS: "ETC",
      MobileApp: "AppTest",
      _type: "json",
      mapX: longitude,
      mapY: latitude,
      radius: 50000,
      listYN: "Y",
    },
    headers: {
      Accept: "application/json",
    },
  });
  return response.data.response.body.items.item.map((item: any) => ({
    title: item.title,
    mapx: parseFloat(item.mapx),
    mapy: parseFloat(item.mapy),
    address: item.addr1 || "주소 정보 없음",
  }));
};

export const useTouristSpots = (latitude: number | null, longitude: number | null): UseQueryResult<TouristSpot[]> => {
  return useQuery({
    queryKey: ["touristSpots", latitude, longitude],
    queryFn: () => {
      if (latitude === null || longitude === null) {
        return Promise.resolve([]);
      }
      return fetchTouristSpots(latitude, longitude);
    },
    enabled: latitude !== null && longitude !== null,
  });
};
