// import { ContentItem } from "@/types/ContentItem.type";
// import axios from "axios";
// import { NextRequest, NextResponse } from "next/server";

// export const GET = async (request: NextRequest, { params }: { params: { MBTIResult: string } }) => {
//   const { MBTIResult } = params;
//   let firstApiUrl = "";
//   let secondApiUrl = "";

//   if (MBTIResult === "1") {
//     firstApiUrl =
//       "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=28&areaCode=&sigunguCode=&cat1=A03&cat2=A0302&cat3=A03021000";
//     secondApiUrl =
//       "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&listYN=Y&arrange=A&contentTypeId=28&areaCode=&sigunguCode=&cat1=A03&cat2=A0302&cat3=A03020800";
//   } else if (MBTIResult === "2") {
//     firstApiUrl =
//       "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&listYN=Y&arrange=A&contentTypeId=28&areaCode=&sigunguCode=&cat1=A03&cat2=A0302&cat3=A03021100";
//     secondApiUrl =
//       "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&listYN=Y&arrange=A&contentTypeId=38&areaCode=&sigunguCode=&cat1=A04&cat2=A0401&cat3=A04010300";
//   } else {
//     return NextResponse.json({ message: "잘못된 MBTIResult 값" });
//   }

//   try {
//     const [firstResponse, secondResponse] = await axios.all([
//       axios.get(firstApiUrl, {
//         params: {
//           serviceKey: process.env.NEXT_PUBLIC_TOURIST_API_KEY,
//           _type: "json",
//           firstImageYN: "Y",
//           numOfRows: 500,
//           pageNo: 1,
//           MobileOS: "ETC",
//           MobileApp: "AppTest",
//           areacodeYN: "Y",
//           catcodeYN: "Y",
//           addrinfoYN: "Y",
//           mapinfoYN: "Y",
//           overviewYN: "Y",
//           defaultYN: "Y",
//         },
//       }),
//       axios.get(secondApiUrl, {
//         params: {
//           serviceKey: process.env.NEXT_PUBLIC_TOURIST_API_KEY,
//           _type: "json",
//           firstImageYN: "Y",
//           numOfRows: 500,
//           pageNo: 1,
//           MobileOS: "ETC",
//           MobileApp: "AppTest",
//           areacodeYN: "Y",
//           catcodeYN: "Y",
//           addrinfoYN: "Y",
//           mapinfoYN: "Y",
//           overviewYN: "Y",
//           defaultYN: "Y",
//         },
//       }),
//     ]);

//     if (firstResponse.data && secondResponse.data) {
//       const firstData: ContentItem[] = firstResponse.data.response.body.items.item;
//       const secondData: ContentItem[] = secondResponse.data.response.body.items.item;

//       const combinedData = [...firstData, ...secondData];

//       return NextResponse.json({ data: combinedData });
//     } else {
//       return NextResponse.json({ message: "데이터가 없습니다" });
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return NextResponse.json({ message: "데이터 패칭 실패" });
//   }
// };
