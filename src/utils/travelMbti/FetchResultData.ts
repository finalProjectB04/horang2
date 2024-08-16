import { Item } from "@/types/APIResponse.type";
import axios from "axios";

export const shuffleArray = (array: Item[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const fetchResultData = async (type: string): Promise<Item[]> => {
  const response = await axios.get(`/api/travelMbti/result/${type}`);
  const { firstData, secondData, thirdData, fourthData, fifthData } = response.data;

  const allData = [...firstData, ...secondData, ...thirdData, ...fourthData, ...fifthData];

  const selectedFirstData = shuffleArray(allData).slice(0, 1);

  const remainingData = allData.filter((item) => !selectedFirstData.includes(item));

  const selectedRemainingData = shuffleArray(remainingData).slice(0, 1);

  return [...selectedFirstData, ...selectedRemainingData];
};
