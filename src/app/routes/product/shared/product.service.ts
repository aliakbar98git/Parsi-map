import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { IHomePageProducts, IProductCategory, IProductListParam, IProductComment, IComment, ISearchableAttribute, IProductSearchParam, IMaxPrice, ICompareList, ICompareProduct, IComparableParam, IComparableProduct, IBreadcrumbProductList, IPriceHistoryParam, IPriceHistory, IProductList, IProductDetail, IProductSEOInfo, ISearchProduct } from './product.model';
import { IResponse, LoadingService } from '@shared/.';


@Injectable()
export class ProductService {
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) { }

  getProductGroup() {
    return this.http.get<IResponse<IProductCategory[]>>(`${environment.apiUrl}/RetailGoodsGroup/GetProductGroup`);
  }

  productSearchKeyword(params: ISearchProduct) {
    let httpParams = new HttpParams().set("MarketingProductName", params.MarketingProductName);
    return this.http.get<IResponse>(`${environment.apiUrl}/MarketingProduct/Search`, { params: httpParams });
  }

  getHomePageProducts() {
    return this.http.get<IResponse<IHomePageProducts>>(`${environment.apiUrl}/MarketingProduct/HomePageProducts`);
  }

  getProductsList(params: IProductListParam) {
    let httpParams = new HttpParams().set("productGroupCode", params.productGroupCode).set("pageNo", '' + params.PageNo);
    return this.http.get<IResponse<IProductList>>(`${environment.apiUrl}/MarketingProduct/List`, { params: httpParams });
  }

  getProductsListBuyFilter(params: IProductSearchParam) {
    return this.http.post<IResponse<IProductList>>(`${environment.apiUrl}/MarketingProduct/ListByFilter`, params);
  }

  getFilterAttributes(retailGoodsGroupCode: string) {
    let httpParams = new HttpParams().set("RetailGoodsGroupCode", retailGoodsGroupCode);
    return this.http.get<IResponse<ISearchableAttribute[]>>(`${environment.apiUrl}/GoodsAttribute/GetSearchableAttributes`, { params: httpParams });
  }

  getMaxPrice(productGroupCode: string) {
    let httpParams = new HttpParams().set("productGroupCode", productGroupCode);
    return this.http.get<IResponse<IMaxPrice>>(`${environment.apiUrl}/MarketingProduct/GetMaxPrice`, { params: httpParams });
  }

  getPromotedProductsList(params: IProductListParam) {
    let httpParams = new HttpParams().set("PageNo", params.PageNo.toString());
    return this.http.get<IResponse<IProductList>>(`${environment.apiUrl}/MarketingProduct/PromotedProducts`, { params: httpParams });
  }

  getBreadcrumbs(retailGoodGroupCode: string) {
    let httpParams = new HttpParams().set("code", retailGoodGroupCode);
    return this.http.get<IResponse<IBreadcrumbProductList[]>>(`${environment.apiUrl}/RetailGoodsGroup/GetBreadcrumbs`, { params: httpParams });
  }

  getProductBreadcrumbs(marketingProductModel: string) {
    let httpParams = new HttpParams().set("MarketingProductModel", marketingProductModel);
    return this.http.get<IResponse<IBreadcrumbProductList[]>>(`${environment.apiUrl}/MarketingProduct/GetBreadCrumbList`, { params: httpParams });
  }

  getProductItem(model: string) {
    let httpParams = new HttpParams().set("Model", model);
    return this.http.get<IResponse<IProductDetail>>(`${environment.apiUrl}/MarketingProduct/Item`, { params: httpParams });
  }

  getProductComments(marketingProductId: string) {
    let httpParams = new HttpParams().set("MarketingProductId", marketingProductId);
    return this.http.get<IResponse<IProductComment[]>>(`${environment.apiUrl}/Comment/GetProductComment`, { params: httpParams });
  }

  createProductComment(comment: IComment) {
    return this.http.post<IResponse<IProductComment>[]>(`${environment.apiUrl}/Comment/CreateComment`, comment, this.httpOptions);
  }

  compareProducts(productsList: ICompareList) {
    let httpParams = new HttpParams();
    productsList.ProductModelList.forEach(item => {
      httpParams = httpParams.append('ProductModelList', item);
    });
    return this.http.get<IResponse<ICompareProduct[]>>(`${environment.apiUrl}/MarketingProduct/CompareProducts`, { params: httpParams });
  }

  getComparableProducts(params: IComparableParam) {
    let httpParams = new HttpParams();
    params.ProductIdList.forEach(item => {
      httpParams = httpParams.append('ProductIdList', item);
    });
    httpParams = httpParams.append('Keyword', params.Keyword);
    return this.http.get<IResponse<IComparableProduct[]>>(`${environment.apiUrl}/MarketingProduct/GetComparableProducts`, { params: httpParams });
  }

  getPriceHistory(params: IPriceHistoryParam) {
    this.loadingService.showLoading();
    let httpParams = new HttpParams().set("MarketingProductId", params.MarketingProductId);
    return this.http.get<IResponse<IPriceHistory>>(`${environment.apiUrl}/MarketingProductPrice/List`, { params: httpParams });
  }

  getSEOInfo(model: string) {
    return this.http.get<IResponse<IProductSEOInfo>>(`${environment.apiUrl}/MarketingProduct/GetSeoInfo?MarketingProductModel=${model}`);
  }
}
