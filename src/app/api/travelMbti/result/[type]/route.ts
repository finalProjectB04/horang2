import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest, { params }: { params: { type: string } }) => {
  const { type } = params;

  if (!type) {
    return NextResponse.json({ error: "type(유형) 파라미터가 필요합니다" }, { status: 400 });
  }

  let firstApiUrl = "";
  let secondApiUrl = "";
  let thirdApiUrl = "";
  let fourthApiUrl = "";
  let fifthApiUrl = "";

  switch (type) {
    case "luxury": // 놀부호랑이
      firstApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=28&areaCode=&sigunguCode=&cat1=A03&cat2=A0302&cat3=A03021000"; // 카지노
      secondApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=28&areaCode=&sigunguCode=&cat1=A03&cat2=A0302&cat3=A03020800"; // 경마
      thirdApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=28&areaCode=&sigunguCode=&cat1=A03&cat2=A0302&cat3=A03021100"; // 승마
      fourthApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&listYN=Y&arrange=A&contentTypeId=38&areaCode=&sigunguCode=&cat1=A04&cat2=A0401&cat3=A04010300"; // 백화점
      fifthApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=32&areaCode=39&sigunguCode=&cat1=B02&cat2=B0201&cat3=B02010100"; // 제주 호텔
      break;
    case "homebody": // 집순이 호랑이
      firstApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=32&areaCode=&sigunguCode=&cat1=B02&cat2=B0201&cat3=B02011100"; // 게스트 하우스
      secondApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/locationBasedList1?&contentTypeId=&mapX=127.2905728&mapY=36.601856&radius=20000"; // 반경 20km
      thirdApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?contentTypeId=39&areaCode=&sigunguCode=&cat1=A05&cat2=A0502&cat3=A05020900"; // 카페
      fourthApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?contentTypeId=32&areaCode=&sigunguCode=&cat1=B02&cat2=B0201&cat3=B02011000"; // 민박
      fifthApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=12&areaCode=&sigunguCode=&cat1=A02&cat2=A0202&cat3=A02020700"; // 공원
      break;
    case "wanderer": // 홍길동 호랑이
      firstApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=12&areaCode=&sigunguCode=&cat1=A01&cat2=A0101&cat3=A01010400";
      secondApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=12&areaCode=&sigunguCode=&cat1=A01&cat2=A0101&cat3=A01010600"; //1~3까지 산 및 바다 휴양
      thirdApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=12&areaCode=&sigunguCode=&cat1=A01&cat2=A0101&cat3=A01011100";
      fourthApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?contentTypeId=32&areaCode=&sigunguCode=&cat1=B02&cat2=B0201&cat3=B02011000"; //민박
      fifthApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?contentTypeId=25&areaCode=&sigunguCode=&cat1=C01&cat2=C0115&cat3=C01150001"; //도보 여행코스
      break;

    case "active": // 활동형 호랑이
      firstApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=28&areaCode=&sigunguCode=&cat1=A03&cat2=A0303&cat3=A03030100"; // 수상레포츠
      secondApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=12&areaCode=&sigunguCode=&cat1=A02&cat2=A0202&cat3=A02020600"; //테마파크
      thirdApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=28&areaCode=&sigunguCode=&cat1=A03&cat2=A0302&"; //육상 레포츠
      fourthApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=15&areaCode=&sigunguCode=&cat1=A02&cat2=A0208&"; //공연 - 행사
      fifthApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=32&areaCode=&sigunguCode=&cat1=B02&cat2=B0201&cat3=B02010500"; //콘도
      break;

    case "foodie": // 식도락 호랑이
      firstApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=39&areaCode=&sigunguCode=&cat1=A05&cat2=A0502&"; // 모든 음식점
      secondApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=25&areaCode=&sigunguCode=&cat1=C01&cat2=C0117&cat3=C01170001"; //맛집 코스
      thirdApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=38&areaCode=&sigunguCode=&cat1=A04&cat2=A0401&cat3=A04010100"; // 5일장
      fourthApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=32&areaCode=&sigunguCode=&cat1=B02&cat2=B0201&cat3=B02011000"; //민박
      fifthApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=12&areaCode=&sigunguCode=&cat1=A02&cat2=A0203&cat3=A02030100"; // 농어촌체험
      break;

    case "cultureLover": // 낭만 호랑이
      firstApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=14&areaCode=&sigunguCode=&cat1=A02&cat2=A0206&cat3=A02060100"; // 박물관
      secondApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=12&areaCode=&sigunguCode=&cat1=A02&cat2=A0201&cat3="; // 역사 관광지
      thirdApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=15&areaCode=&sigunguCode=&cat1=A02&cat2=A0207&cat3=A02070100"; // 문화관광축제
      fourthApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=38&areaCode=&sigunguCode=&cat1=A04&cat2=A0401&cat3=A04010700"; // 전통 공예/공방
      fifthApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=32&areaCode=&sigunguCode=&cat1=B02&cat2=B0201&cat3=B02011600"; // 한옥 숙박
      break;

    case "relaxationSeeker": // 휴양추구형 호랑이
      firstApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=32&areaCode=39&sigunguCode=&cat1=B02&cat2=B0201&cat3="; // 제주도의 모든 숙박
      secondApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=28&areaCode=&sigunguCode=&cat1=A03&cat2=A0303&cat3="; // 전국의 수상 레포츠
      thirdApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=12&areaCode=&sigunguCode=&cat1=A01&cat2=A0101&cat3=A01011200"; // 전국의 해수욕장
      fourthApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?contentTypeId=12&areaCode=&sigunguCode=&cat1=A01&cat2=A0101&cat3=A01011300"; // 전국 섬 휴양지
      fifthApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=12&areaCode=&sigunguCode=&cat1=A02&cat2=A0202&cat3=A02020800"; // 유람선/ 잠수함 관광
      break;

    case "cityTraveler": // 도시 여행자형 호랑이
      firstApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=39&areaCode=1&sigunguCode=&cat1=A05&cat2=A0502&cat3="; // 서울의 모든 음식점/카페
      secondApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=39&areaCode=6&sigunguCode=&cat1=A05&cat2=A0502&cat3="; // 부산의 모든 음식점/카페
      thirdApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=32&areaCode=6&sigunguCode=&cat1=B02&cat2=B0201&cat3=B02010100"; // 부산의 모든 관광호텔
      fourthApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=32&areaCode=1&sigunguCode=&cat1=B02&cat2=B0201&cat3=B02010100"; // 서울의 모든 관광호텔
      fifthApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=15&areaCode=1&sigunguCode=&cat1=A02&cat2=A0207&cat3=A02070200"; // 서울의 모든 일반축제
      break;

    case "cheap": // 흥부 호랑이
      firstApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=14&areaCode=&sigunguCode=&cat1=A02&cat2=A0206&cat3=A02060300"; // 전시관
      secondApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=14&areaCode=&sigunguCode=&cat1=A02&cat2=A0206&cat3=A02060900"; // 전국의 유명한 도서관
      thirdApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=32&areaCode=&sigunguCode=&cat1=B02&cat2=B0201&cat3=B02011100"; // 게스트 하우스
      fourthApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=25&areaCode=&sigunguCode=&cat1=C01&cat2=C0113&cat3="; // 나홀로 코스
      fifthApiUrl =
        "http://apis.data.go.kr/B551011/KorService1/areaBasedList1?&contentTypeId=38&areaCode=&sigunguCode=&cat1=A04&cat2=A0401&cat3=A04010100"; // 5일장
      break;

    default:
      return NextResponse.json({ error: "허가되지 않은 type(유형)" }, { status: 400 });
  }

  try {
    const params = {
      serviceKey: process.env.NEXT_PUBLIC_TOURIST_API_KEY,
      _type: "json",
      numOfRows: 50,
      pageNo: 1,
      MobileOS: "ETC",
      MobileApp: "AppTest",
    };

    const urls = [firstApiUrl, secondApiUrl, thirdApiUrl, fourthApiUrl, fifthApiUrl];

    const requests = urls.map((url) => axios.get(url, { params }));

    const [firstResponse, secondResponse, thirdResponse, fourthResponse, fifthResponse] = await axios.all(requests);

    const firstData = firstResponse.data?.response?.body?.items?.item || [];
    const secondData = secondResponse.data?.response?.body?.items?.item || [];
    const thirdData = thirdResponse.data?.response?.body?.items?.item || [];
    const fourthData = fourthResponse.data?.response?.body?.items?.item || [];
    const fifthData = fifthResponse.data?.response?.body?.items?.item || [];

    return NextResponse.json({
      firstData,
      secondData,
      thirdData,
      fourthData,
      fifthData,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("데이터 펫칭에 에러가 생겼습니다:", error.message);
      return NextResponse.json({ error: "데이터 펫칭에 에러가 생겼습니다", details: error.message });
    } else {
      console.error("예상치못한 에러:", error);
      return NextResponse.json({ error: "예상치못한 에러", details: error });
    }
  }
};
