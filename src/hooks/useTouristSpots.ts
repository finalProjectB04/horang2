import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchTouristSpots = async (latitude, longitude) => {
  const response = await axios.get(`/api/location`, {
    params: { latitude, longitude },
  });

  console.log("Response data:", response.data);
  return response.data.response.body.items.item;
};

export const useTouristSpots = (latitude, longitude) => {
  return useQuery({
    queryKey: ["touristSpots", latitude, longitude],
    queryFn: () => fetchTouristSpots(latitude, longitude),
  });
};
