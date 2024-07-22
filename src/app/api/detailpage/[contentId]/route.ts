// import { ContentItem } from "@/types/ContentItem.type";

// const axios = require("axios");

// export const getContentId = async (contentId: string): Promise<ContentItem | null> => {
//   try {
//     const response = await axios.get("http://apis.data.go.kr/B551011/KorService1/detailCommon1", {
//       params: {
//         serviceKey: process.env.NEXT_PUBLIC_MY_API_KEY,
//         numOfRows: 1,
//         pageNo: 1,
//         MobileOS: "ETC",
//         MobileApp: "AppTest",
//         contentId: contentId,
//         firstImageYN: "Y",
//         areacodeYN: "Y",
//         catcodeYN: "Y",
//         addrinfoYN: "Y",
//         mapinfoYN: "Y",
//         overviewYN: "Y",
//         defaultYN: "Y",
//         _type: "json",
//       },
//     });

//     if (response.data && response.data.response.body.items.item.length > 0) {
//       return response.data.response.body.items.item[0] as ContentItem;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return null;
//   }
// };

import { ContentItem } from "@/types/ContentItem.type";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const GET = async (request: NextApiRequest, response: NextApiResponse) => {
  const id = response.params.contentId; // 이 경로로 값을 내려받는데 왜 오류나는지 모르겠음.
  try {
    const response = await axios.get("http://apis.data.go.kr/B551011/KorService1/detailCommon1", {
      params: {
        serviceKey: process.env.NEXT_PUBLIC_TOURIST_API_KEY,
        numOfRows: 1,
        pageNo: 1,
        MobileOS: "ETC",
        MobileApp: "AppTest",
        contentId: id,
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

// if (response.data) {
//   const data: ContentItem = response.data.response.body.items.item[0];

//   return NextResponse.json({ data });
// } else {
//   return NextResponse.json({ messasge: "데이타가 없습니다" });
// }
// } catch (error) {
// console.error("Error fetching data:", error);
// return NextResponse.json({ message: "데이터 펫칭 실패" });
// }
