import { ApiInformation } from "@/types/Main";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  const apiKey = process.env.NEXT_PUBLIC_TOURIST_API_KEY;
  const baseUrl = "https://apis.data.go.kr/B551011/KorService1/areaBasedList1";

  try {
    const response = await axios.get(baseUrl, {
      params: {
        serviceKey: apiKey,
        numOfRows: 1000,
        pageNo: 1,
        MobileOS: "ETC",
        MobileApp: "horang",
        _type: "json",
        listYN: "Y",
        arrange: "C",
        contentTypeId: "15",
      },
    });

    if (response.data.response.body.items.item.length > 0) {
      return NextResponse.json(response.data.response.body.items.item as ApiInformation[]);
    } else {
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
