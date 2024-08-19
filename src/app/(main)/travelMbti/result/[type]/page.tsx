"use client";

import LoadingPage from "@/app/loading";
import Recommend from "@/components/recommend/Recommend";
import { Item } from "@/types/APIResponse.type";
import { fetchResultData } from "@/utils/travelMbti/FetchResultData";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { results } from "../results";

const TypeResultPage = () => {
  const params = useParams(); // useParams로 URL 파라미터를 가져옵니다.
  const type = params.type as string; // type을 문자열로 변환합니다.
  const router = useRouter();

  const { data, error, isLoading }: UseQueryResult<Item[], Error> = useQuery({
    queryKey: ["resultData", type],
    queryFn: () => fetchResultData(type),
    enabled: !!type && !!results[type],
    retry: 1,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  if (!type || !results[type]) {
    return <div>유효하지 않은 결과입니다.</div>;
  }

  const result = results[type];

  if (isLoading) return <LoadingPage />;
  if (error) return <p>{(error as Error).message}</p>;

  return (
    <div
      className="w-full h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url(/assets/images/backgrounds/backgrounds.png)" }}
    >
      <div className="flex justify-center items-start h-full py-10 px-4">
        <div className="bg-white p-6 rounded-[40px] sm:w-[350px] h-[80vh] w-[500px] flex flex-col max-h-[80vh] overflow-auto relative">
          <div className="relative pb-16">
            <header className="absolute top-0 left-0 right-0 bg-white p-5 rounded-t-[40px] z-10">
              <h1 className="text-3xl sm:text-xl font-bold text-center">여행 MBTI 결과</h1>
              <button onClick={() => router.back()} className="absolute top-4 left-4 p-2">
                <img src="/assets/images/back.svg" alt="뒤로가기" className="w-5 h-5" />
              </button>
            </header>
          </div>

          <div className="pt-8 flex flex-col flex-1 p-4 overflow-auto">
            <div className="flex flex-col text-center mb-6 justify-center items-center">
              <h2 className="text-3xl sm:text-xl font-semibold mb-2">당신의 유형은</h2>
              {/* <h3 className="text-3xl sm:text-2xl font-bold text-primary-600">{result.title}</h3> */}
              {result.image ? (
                <Image
                  src={result.image}
                  alt={result.title}
                  width={400}
                  height={400}
                  style={{ width: "400px", height: "auto" }}
                />
              ) : (
                <div className="w-[400px] h-[400px] bg-grey-200">이미지 없음</div>
              )}
              <p className="mt-6 text-[16px] sm:text-[14px]">{result.description}</p>
            </div>
            <div className="flex flex-col text-center mb-8 mt-8">
              <h2 className="text-3xl sm:text-xl font-semibold mb-6">당신을 위한 여행지는</h2>
              <Recommend data={data || []} MBTIResult={type} />
            </div>
            <div className="flex flex-col gap-2 mt-6 text-center w-full">
              <Link
                href="/travelMbti"
                className="bg-primary-300 text-white p-2.5 rounded shadow-sm hover:bg-primary-500 text-[14px]"
              >
                다시 시작하기
              </Link>
              <Link
                href="/travelMbti/result"
                className="bg-secondary-500 text-white p-2.5 rounded shadow-sm hover:bg-secondary-700 text-[14px]"
              >
                전체 유형보러가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypeResultPage;
