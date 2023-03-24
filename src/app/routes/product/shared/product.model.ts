import { ImageType } from '@shared/_enums/imageType.enum';

export interface IProduct {
  marketingProductId: string;
  retailGoodsGroupId: string;
  marketingProductModel: string;
  marketingProductName: string;
  price: number;
  priceByDiscount: number;
  hasInventory: boolean;
  documentInfoId: string;
  score: number;
  description: string;
  promotionEndDate: string;
  imageType: ImageType;
  discountPercent: number;
  ribbonList: string[];
}

export interface IProductDetail {
  favoriteStatus: boolean;
  guaranteeId: string;
  guaranteeTitle: string;
  marketingProductAttachments: IProductAttachment[];
  product: {
    additionalInfo: string;
    createdOn: string;
    description: string;
    discountPercent: number;
    documentInfoId: string;
    giftCardAmount: number;
    giftCardBankId: number;
    hasInventory: boolean;
    imageType: ImageType;
    keywords: string;
    marketingProductId: string;
    marketingProductModel: string;
    marketingProductName: string;
    metaDescription: string;
    parentRetailGoodsGroupId: string;
    price: number;
    priceByDiscount: number
    promotionEndDate: string;
    promotionType: number
    relatedMarketingProductId: string;
    retailGoodsGroupId: string;
    score: number;
    videoUrl: string;
  }
  productAttributes: IAttributeContainer[];
  relatedMarketingProductList: string
  showHeaderContainer: IProductHeaderContainer[]
}

export interface IProductAttachment {
  documentInfoId: string;
  documentName: string;
  imageType: ImageType;
  isVideo: boolean;
}

export interface IRelatedProduct {
  marketingProductName: string;
  marketingProductModel: string;
  color: number;
}

export interface IProductHeaderContainer {
  createdOn: string;
  goodAttributeType: number;
  goodsAttributeId: string;
  goodsAttributeItemTitle: string;
  goodsAttributeValue: string;
  label: string;
  order: number;
}

export interface IHomePageProducts {
  mostSoldProduct: IProduct[];
  mostViewedProduct: IProduct[];
  newestProduct: IProduct[];
  promotedProduct: IProduct[];
}

export interface IProductCategory {
  code: string;
  documentInfoId: string;
  hasAttribute: false;
  id: string;
  level: number;
  parentId: string;
  title: string;
  imageType: ImageType;
}

export interface IProductList {
  comparable: boolean;
  marketingProductList: IProduct[]
  pageNo: number
  pageSize: number
  total: number
}

export interface IProductListParam {
  productGroupCode?: string;
  PageNo: number;
}

export interface IProductComment {
  commentOwner: string;
  commentText: string;
  createdOn: string;
  id: string;
  referenceId: string;
  score: number;
}

export interface IComment {
  Score: number;
  Comment: string;
  MarketingProductId: string;
}

export interface ISearchableAttribute {
  attributeItemDtoList: ISearchableAttributeItem[];
  goodAttributeType: number;
  label: string;
  multiSelect: boolean;
  name: string;
}

export interface ISearchableAttributeItem {
  color: string;
  id: number;
  order: number;
  title: string;
}

export interface IProductSearchParam {
  RetailGoodGroupCode: string;
  PageNo: number;
  PageSize: number;
  SortType: SortType;
  ProductFilterListDto: IProductFilterParams;
  ProductName: string;
}

export enum SortType {
  Unspecified = 0,
  CreatedOn = 1,
  AscendingPrice = 2,
  DescendingPrice = 3
}

export interface IProductFilterParams {
  MinPrice: number;
  MaxPrice: number;
  HasInventory: boolean;
  HasDifferentGrade: boolean;
  ProductFilterAttributeDtoList: IProductFilterItem[]
}

export interface IProductFilterItem {
  Name: string;
  Value?: string;
  List?: string[];
}

export interface IBreadcrumb {
  url: string;
  title: string;
}

export interface IBreadcrumbProductList {
  code: string;
  level: number;
  title: string;
}

export interface IMaxPrice {
  maxPrice: number
}

export interface ICompareList {
  ProductModelList: string[]
}

export interface ICompareProduct {
  attributes: IAttributeContainer[];
  documentInfoId: string;
  marketingProductId: string;
  marketingProductModel: string;
  marketingProductName: string;
  price: number;
  priceByDiscount: number;
  retailGoodsGroupId: string;
  imageType: ImageType;
  score: number;
  hasInventory: boolean;
}

export interface IAttributeContainer {
  attributeList?: IAttributeItem[];
  containerId?: number;
  containerOrderId?: number;
  containerTitle: string;
}

export interface IAttributeItem {
  createdOn?: string;
  goodAttributeType?: number;
  goodsAttributeId?: string;
  goodsAttributeItemTitle?: string;
  goodsAttributeValue?: string;
  label?: string;
  order?: number;
  score?: number
}

export interface IComparableParam {
  ProductIdList: string[];
  Keyword: string;
}

export interface IComparableProduct {
  documentInfoId: string;
  marketingProductId: string;
  marketingProductModel: string;
  marketingProductName: string;
  imageType: ImageType;
}

export interface IPriceHistoryParam {
  MarketingProductId: string;
}

export interface IPriceHistory {
  monthCountDiff: number;
  productPriceHistoryList: IPriceHistoryList[];
}

export interface IPriceHistoryList {
  date: string;
  persianDate: string;
  price: number;
  row: number;
}
export interface IProductSEOInfo {
  keyWord: string;
  metaData: string;
}
export interface ISearchProduct {
  MarketingProductName: string;
  RetailGoodGroupCode?: string;
}

export interface IGetInventoryAnnouncement {
  mobileNumber: string;
  email: string;
  mobileNumberConfirmed: boolean;
  emailConfirmed: boolean;
}
