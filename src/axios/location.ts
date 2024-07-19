import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://apis.data.go.kr/B551011/KorService/locationBasedList";
const SERVICE_KEY = "YOUR_SERVICE_KEY";

const fetchTouristSpots = async (latitude: number, longitude: number) => {
  const response = await axios.get(API_URL, {
    params: {
      ServiceKey: SERVICE_KEY,
      mapX: longitude,
      mapY: latitude,
      radius: 1000,
      MobileOS: "ETC",
      MobileApp: "AppTest",
      _type: "json",
    },
  });

  console.log("Response data:", response.data);
  return response.data.response.body.items.item;
};

export const useTouristSpots = (latitude: number, longitude: number) => {
  return useQuery({
    queryKey: ["touristSpots", latitude, longitude],
    queryFn: () => fetchTouristSpots(latitude, longitude),
  });
};
