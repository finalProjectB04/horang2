import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";

export type TouristSpot = {
  title: string;
  mapx: number;
  mapy: number;
  address: string;
  contentid: string;
  firstimage: string | null;
  tel: string;
};

type ApiTouristSpot = {
  title: string;
  mapx: string;
  mapy: string;
  addr1?: string;
  contentid: string;
  firstimage?: string;
  tel?: string;
};

const fetchTouristSpots = async (latitude: number, longitude: number): Promise<TouristSpot[]> => {
  const response = await axios.get("https://apis.data.go.kr/B551011/KorService1/locationBasedList1", {
    params: {
      ServiceKey: process.env.NEXT_PUBLIC_TOURIST_API_KEY,
      contentTypeId: 12,
      numOfRows: 100,
      pageNo: 1,
      MobileOS: "ETC",
      MobileApp: "horang",
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

  const items: ApiTouristSpot[] = response.data.response.body.items.item;

  return items.map((item) => ({
    title: item.title,
    mapx: parseFloat(item.mapx),
    mapy: parseFloat(item.mapy),
    address: item.addr1 || "주소 정보 없음",
    contentid: item.contentid,
    firstimage: item.firstimage || null,
    tel: item.tel || "전화번호 없음",
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
