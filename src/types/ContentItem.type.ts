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
