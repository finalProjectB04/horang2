import axios from "axios";
import { ApiInformation } from "@/types/Main";
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_TOURIST_API_KEY;
  const baseUrl = "http://apis.data.go.kr/B551011/KorService1/areaBasedList1";

  try {
    const response = await axios.get(baseUrl, {
      params: {
        serviceKey: apiKey,
        numOfRows: 1000,
        pageNo: 1,
        MobileOS: "ETC",
        MobileApp: "TestApp",
        _type: "json",
        listYN: "Y",
        arrange: "A",
        contentTypeId: "39",
        areaCode: "1",
      },
    });

    if (response.data.response.body.items.item.length > 0) {
      return NextResponse.json(response.data.response.body.items.item as ApiInformation[]);
    } else {
      NextResponse.json(null);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}
