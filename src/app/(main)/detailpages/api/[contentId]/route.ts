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

const getContentId = async (req: NextApiRequest, res: NextApiResponse) => {
  const { contentId } = req.query;

  try {
    const response = await axios.get("http://apis.data.go.kr/B551011/KorService1/detailCommon1", {
      params: {
        serviceKey: process.env.NEXT_PUBLIC_MY_API_KEY,
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

    if (response.data && response.data.response.body.items.item.length > 0) {
      const data: ContentItem = response.data.response.body.items.item[0];
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "No data found" });
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

export default getContentId;
