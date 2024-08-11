export interface APIResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: Item[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

export interface Item {
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
}
