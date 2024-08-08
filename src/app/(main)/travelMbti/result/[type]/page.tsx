"use client";

import Recommend from "@/components/recommend/Recommend";
import { Item } from "@/types/APIResponse.type";
import axios from "axios";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { results } from "../results";

const shuffleArray = (array: Item[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const TypeResultPage = () => {
  const params = useParams(); // useParams로 URL 파라미터를 가져옵니다.
  const type = params.type as string; // type을 문자열로 변환합니다.
  const router = useRouter();
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/travelMbti/result/${type}`);
        console.log("API response:", response.data);

        const { firstData, secondData, thirdData, fourthData, fifthData } = response.data;

        const allData = [...firstData, ...secondData, ...thirdData, ...fourthData, ...fifthData];

        const selectedFirstData = shuffleArray(allData).slice(0, 1);

        const remainingData = allData.filter((item) => !selectedFirstData.includes(item));

        const selectedRemainingData = shuffleArray(remainingData).slice(0, 2);

        const combinedData = [...selectedFirstData, ...selectedRemainingData];

        setData(combinedData);
        console.log("Filtered and combined data:", combinedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      }

      setLoading(false);
    };

    if (type && results[type]) {
      fetchData();
    }
  }, [type]);

  if (!type || !results[type]) {
    return <div>유효하지 않은 결과입니다.</div>;
  }

  const result = results[type];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url(/assets/images/backgrounds/backgrounds.png)" }}
    >
      <div className="flex justify-center items-start h-full pt-10">
        <div className="bg-white p-8 rounded-[40px] w-[500px] flex flex-col min-h-[85%] max-h-[85%] overflow-auto">
          <div className="relative mb-6">
            <header className="py-4 px-6 flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold text-center">여행 MBTI 결과</h1>
            </header>
            <button
              onClick={() => router.back()} // 브라우저의 이전 페이지로 이동합니다.
              className="absolute top-4 left-4 p-2"
            >
              <img src="/assets/images/back.svg" alt="뒤로가기" className="w-6 h-6" />
            </button>
          </div>

          <main className="flex flex-col items-center justify-center flex-1 p-4 overflow-auto">
            <header className="flex flex-col text-center mb-6">
              <h2 className="text-3xl font-semibold mb-4">당신의 유형은</h2>
              <h3 className="text-4xl font-bold text-primary-600">{result.title}</h3>
              <p className="mt-6 text-[16px]">{result.description}</p>
            </header>
            <div>
              <Recommend data={data} MBTIResult={type} />
              {/* <button onClick={() => setIsModalOpen(true)}>
                <Image src="/assets/images/shareModal.svg" alt="Custom Button Image" width={48} height={48} />
              </button>
              <ShareModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
            </div>

            <div className="flex flex-col gap-4 mt-8 text-center w-full">
              <Link href="/travelMbti" className="bg-primary-300 text-white p-3 rounded shadow-sm hover:bg-primary-500">
                다시 시작하기
              </Link>
              <Link
                href="/travelMbti/result"
                className="bg-third-600 text-white p-3 rounded shadow-sm hover:bg-third-700"
              >
                전체 유형보러가기
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TypeResultPage;
