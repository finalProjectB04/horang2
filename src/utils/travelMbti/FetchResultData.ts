import { Item } from "@/types/APIResponse.type";
import axios from "axios";

export const shuffleArray = (array: Item[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getRandomItem = (array: Item[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const fetchResultData = async (type: string): Promise<Item[]> => {
  const response = await axios.get(`/api/travelMbti/result/${type}`);
  const { firstData, secondData, thirdData, fourthData, fifthData } = response.data;

  const selectedItems = [
    getRandomItem(firstData),
    getRandomItem(secondData),
    getRandomItem(thirdData),
    getRandomItem(fourthData),
    getRandomItem(fifthData),
  ];

  const finalSelection = shuffleArray(selectedItems).slice(0, 2);

  return finalSelection;
};
