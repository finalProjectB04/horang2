import { ContentItem } from "@/types/ContentItem.type";

const axios = require("axios");

export const getStayList = async () => {
  try {
    const response = await axios.get("https://apis.data.go.kr/B551011/KorService1/searchStay1", {
      params: {
        serviceKey: process.env.NEXT_PUBLIC_MY_API_KEY,
        numOfRows: 20, //한 페이지에 표기할 아이템의 갯수
        pageNo: 5, //페이지 갯수
        MobileOS: "ETC",
        MobileApp: "AppTest",
        _type: "json",
      },
    });

    if (response.data && response.data.response.body.items.item.length > 0) {
      return response.data.response.body.items.item[0] as ContentItem;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const getRestaurantList = async () => {
  try {
    const response = await axios.get("http://apis.data.go.kr/B551011/KorService1/areaBasedList1", {
      params: {
        serviceKey: process.env.NEXT_PUBLIC_MY_API_KEY,
        numOfRows: 20, //한 페이지에 표기할 아이템의 갯수
        pageNo: 5, //페이지 갯수
        MobileApp: "AppTest",
        MobileOS: "ETC",
        arrange: "O",
        contentTypeId: 39,
        areaCode: 1, // 지역코드 참고 현재는 강남 기준
        sigunguCode: 1, //시군구 코드 참고.
        _type: "json",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

//지역기반 레포츠 정보

export const getReportsList = async () => {
  try {
    const response = await axios.get("https://apis.data.go.kr/B551011/KorService1/areaBasedList1", {
      params: {
        serviceKey: process.env.NEXT_PUBLIC_MY_API_KEY,
        contentTypeId: 28,
        numOfRows: 20, //한 페이지에 표기할 아이템의 갯수
        pageNo: 5, //페이지 갯수
        MobileOS: "MobileOS",
        MobileApp: "MobileApp",
        _type: "json",
        listYN: "Y",
        arrange: "O",
        areaCode: 1, // 지역코드 참고 현재는 강남 기준
        sigunguCode: 1, //시군구 코드 참고.
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

export const getFestivalList = async () => {
  try {
    const response = await axios.get("https://apis.data.go.kr/B551011/KorService1/areaBasedList1", {
      params: {
        serviceKey: process.env.NEXT_PUBLIC_MY_API_KEY,
        contentTypeId: 15,
        numOfRows: 20,
        pageNo: 5,
        MobileOS: "MobileOS",
        MobileApp: "MobileApp",
        _type: "json",
        listYN: "Y",
        arrange: "O",
        areaCode: 1, // 지역코드 참고 현재는 강남 기준
        sigunguCode: 1, //시군구 코드 참고.
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

//변경 가능한 params

//  listYN
// string
// (query)
// 목록구분(Y=목록, N=개수)

// arrange
// string
// (query)
// 정렬구분 (A=제목순, C=수정일순, D=생성일순) 대표이미지가반드시있는정렬(O=제목순, Q=수정일순, R=생성일순)

// areaCode
// string
// (query)
// 지역코드(지역코드조회 참고)

// sigunguCode
// string
// (query)
// 시군구코드(지역코드조회 참고)
