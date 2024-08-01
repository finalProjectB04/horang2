import { ContentItem } from "@/types/ContentItem.type";

import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, { params }: { params: { contentId: string } }) => {
  const { contentId } = params;

  console.log("contentId:", contentId); // 디버깅을 위해 콘솔 로그 추가
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/detailCommon1`, {
      params: {
        serviceKey: process.env.NEXT_PUBLIC_TOURIST_API_KEY,
        numOfRows: 1,
        pageNo: 1,
        MobileOS: "ETC",
        MobileApp: "AppTest",
        contentId: contentId,
        firstImageYN: "Y",
        areacodeYN: "Y",
        catcodeYN: "Y",
        addrinfoYN: "Y",
        mapinfoYN: "Y",
        overviewYN: "Y",
        defaultYN: "Y",
        _type: "json",
      },
    });

    if (response.data) {
      const data: ContentItem = response.data.response.body.items.item[0];

      return NextResponse.json({ data });
    } else {
      return NextResponse.json({ messasge: "데이타가 없습니다" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ message: "데이터 펫칭 실패" });
  }
};
