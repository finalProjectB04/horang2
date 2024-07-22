// export interface ContentItem {
//   response: {
//     header: {
//       resultCode: string;
//       resultMsg: string;
//     };
//     body: {
//       items: {
//         item: [
//           {
//             contentid: string;
//             contenttypeid: string;
//             title: string;
//             createdtime: string;
//             modifiedtime: string;
//             tel?: string;
//             telname?: string;
//             homepage?: string;
//             booktour?: string;
//             firstimage?: string;
//             firstimage2?: string;
//             cpyrhtDivCd?: string;
//             areacode?: string;
//             sigungucode?: string;
//             cat1?: string;
//             cat2?: string;
//             cat3?: string;
//             addr1?: string;
//             addr2?: string;
//             zipcode?: string;
//             mapx: string;
//             mapy: string;
//             mlevel?: string;
//             overview?: string;
//           },
//         ];
//       };
//       numOfRows: number;
//       pageNo: number;
//       totalCount: number;
//     };
//   };
// }

// export interface Item {
//   contentid: string;
//   contenttypeid: string;
//   title: string;
//   createdtime: string;
//   modifiedtime: string;
//   tel?: string;
//   telname?: string;
//   homepage?: string;
//   booktour?: string;
//   firstimage?: string;
//   firstimage2?: string;
//   cpyrhtDivCd?: string;
//   areacode?: string;
//   sigungucode?: string;
//   cat1?: string;
//   cat2?: string;
//   cat3?: string;
//   addr1?: string;
//   addr2?: string;
//   zipcode?: string;
//   mapx: string;
//   mapy: string;
//   mlevel?: string;
//   overview?: string;
// }

// export interface ContentItem {
//   response: {
//     header: {
//       resultCode: string;
//       resultMsg: string;
//     };
//     body: {
//       items: {
//         item: Item[];
//       };
//       numOfRows: number;
//       pageNo: number;
//       totalCount: number;
//     };
//   };
// }

// export interface ContentItem {
//   contentid: string;
//   contenttypeid: string;
//   title: string;
//   createdtime: string;
//   modifiedtime: string;
//   tel?: string;
//   telname?: string;
//   homepage?: string;
//   booktour?: string;
//   firstimage?: string;
//   firstimage2?: string;
//   cpyrhtDivCd?: string;
//   areacode?: string;
//   sigungucode?: string;
//   cat1?: string;
//   cat2?: string;
//   cat3?: string;
//   addr1?: string;
//   addr2?: string;
//   zipcode?: string;
//   mapx: string;
//   mapy: string;
//   mlevel?: string;
//   overview?: string;
// }

export type ContentItem = {
  data: {
    addr1?: string;
    addr2?: string;
    areacode?: string;
    booktour?: string;
    cat1?: string;
    cat2?: string;
    cat3?: string;
    contentid: string;
    contenttypeid: string;
    cpyrhtDivCd?: string;
    createdtime: string;
    firstimage?: string;
    firstimage2?: string;
    homepage?: string;
    mapx: string;
    mapy: string;
    mlevel?: string;
    modifiedtime: string;
    overview?: string;
    sigungucode?: string;
    tel?: string;
    telname?: string;
    title: string;
    zipcode?: string;
    numOfRows: number;
    pageNo: number;
    totalCount: number;
  };
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: [];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
};
