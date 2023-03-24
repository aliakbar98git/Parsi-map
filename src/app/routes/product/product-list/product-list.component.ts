import { Subscription, timer } from 'rxjs';
import { Component, OnInit, PLATFORM_ID, Inject, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import noUiSlider from 'nouislider';
import { finalize } from 'rxjs/operators';
import { ProductService, IProductList, IProductListParam } from '../shared';
import { ISearchableAttribute, IProductSearchParam, IProductFilterParams, SortType, IBreadcrumb, IMaxPrice, IProduct, IBreadcrumbProductList, IProductFilterItem } from './../shared/product.model';
import { ToastService } from '@shared/toast/toast.service';
import { UserService, UserType } from '../../user/shared';
import { ProductItemComponent } from '..';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  private windowSize: number;
  private subscriptions: Subscription = new Subscription();
  isSearch: boolean = false;
  isBrowser: boolean;
  data: IProductList;
  breadcrumbs: IBreadcrumb[] = [];
  filterAttributes: ISearchableAttribute[] = null;
  compareList: IProduct[] = [];
  showRemoveFilter: boolean = false;
  priceRange: any;
  maxPrice: IMaxPrice;
  page: number = 1;
  params: IProductListParam = {
    productGroupCode: '',
    PageNo: this.page,
  }
  filterParams: IProductFilterParams = {
    MinPrice: null,
    MaxPrice: null,
    HasInventory: null,
    HasDifferentGrade: null,
    ProductFilterAttributeDtoList: []
  };
  searchParam: IProductSearchParam = {
    RetailGoodGroupCode: null,
    PageNo: 1,
    PageSize: 9,
    SortType: SortType.CreatedOn,
    ProductFilterListDto: this.filterParams,
    ProductName: ''
  };
  showLoading: boolean;
  faTimes = faTimes;
  userType: typeof UserType;

  urlParams: Params;
  urlParamsLength: number;

  constructor(
    private activeRoute: ActivatedRoute,
    private productService: ProductService,
    private viewportScroller: ViewportScroller,
    private router: Router,
    private toastService: ToastService,
    private title: Title,
    @Inject(PLATFORM_ID) platformId: Object,
    public userService: UserService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.userType = UserType;
  }

  ngOnInit(): void {
    this.urlParams = this.activeRoute.snapshot.queryParams;
    this.urlParamsLength = Object.keys(this.urlParams).length;
    if (this.isBrowser) this.subscriptions.add(timer().subscribe(() => this.onResize()));

    Object.keys(this.urlParams).forEach(filter => {
      switch (filter) {
        case 'page':
          this.page = Number(this.urlParams.page);
          break;
        case 'SortType':
          this.searchParam.SortType = Number(this.urlParams.SortType);
          break;
        case 'HasInventory':
          this.filterParams.HasInventory = true;
          break;
        case 'HasDifferentGrade':
          this.filterParams.HasDifferentGrade = true;
          break;
        case 'MinPrice':
          this.filterParams.MinPrice = Number(this.urlParams.MinPrice);
          break;
        case 'MaxPrice':
          this.filterParams.MaxPrice = Number(this.urlParams.MaxPrice);
          break;
        default:
          if (filter.indexOf('[]') == -1) {
            this.filterParams.ProductFilterAttributeDtoList.push({ Name: filter, Value: this.urlParams[filter] });
          } else {
            this.filterParams.ProductFilterAttributeDtoList.push({ Name: filter.replace('[]', ''), List: this.urlParams[filter].split('-') });
          }
      }
    });

    this.subscriptions.add(this.activeRoute.params.subscribe((routeParams) => {
      this.urlParams = this.activeRoute.snapshot.queryParams;
      this.urlParamsLength = Object.keys(this.urlParams).length;
      this.page = this.urlParams.page != undefined ? Number(this.urlParams.page) : 1;

      if (this.urlParamsLength == 0) {
        this.resetFilters(this.page);
        this.searchParam.SortType = SortType.CreatedOn;
      }

      if (routeParams.keyword != undefined) {
        this.isSearch = true;
        this.searchParam.ProductName = routeParams.keyword;
        this.getProductsListByFilter();
      }
      if (!this.isSearch) {
        this.params.productGroupCode = routeParams.code;
        this.searchParam.RetailGoodGroupCode = routeParams.code;
        this.data = undefined;
        this.getBreadcrumbs();
        if (this.urlParamsLength == 0 || (this.urlParamsLength == 1 && this.urlParams.page != undefined)) {
          this.getProductsList();
        } else {
          this.getProductsListByFilter();
          this.showRemoveFilter = true;
        }
        this.getMaxPrice();
        this.getFilterAttributes();
      }
      this.compareList = []
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public get sortType(): typeof SortType {
    return SortType;
  }

  getBreadcrumbs() {
    this.productService.getBreadcrumbs(this.params.productGroupCode).subscribe(response => {
      const breadcrumb: IBreadcrumb[] = [];
      response.data.forEach((item: IBreadcrumbProductList) => breadcrumb.push({ title: item.title, url: `/category/${item.code}` }));
      this.breadcrumbs = breadcrumb;
      const breadcrumbLastItem = this.breadcrumbs[this.breadcrumbs.length - 1].title;
      this.title.setTitle(`${breadcrumbLastItem} | خرید و قیمت انواع ${breadcrumbLastItem} جی‌پلاس و برندهای برتر`)
    });
  }

  getProductsList() {
    this.params.PageNo = this.page;
    this.showLoading = true;
    this.productService.getProductsList(this.params).pipe(finalize(() => this.showLoading = false)).subscribe(response => {
      this.data = response.data;
      this.viewportScroller.scrollToAnchor("content-container");
    });
  }

  getProductsListByFilter() {
    this.showLoading = true;
    this.searchParam.ProductFilterListDto = this.filterParams;
    this.searchParam.PageNo = this.page;
    this.data = undefined;
    this.productService.getProductsListBuyFilter(this.searchParam).pipe(finalize(() => this.showLoading = false)).subscribe(response => {
      this.data = response.data;
      this.viewportScroller.scrollToAnchor("content-container");
    });
  }

  getMaxPrice() {
    if (!this.isBrowser) return;
    this.productService.getMaxPrice(this.params.productGroupCode).subscribe(response => {
      if (this.priceRange != undefined) {
        this.priceRange.noUiSlider.destroy();
        this.priceRange = undefined;
      }

      this.maxPrice = response.data;
      if (this.maxPrice != null && this.maxPrice.maxPrice != null) {
        this.priceRange = document.getElementById('price-range');
        noUiSlider.create(this.priceRange, {
          start: [this.filterParams.MinPrice != null ? this.filterParams.MinPrice : 0, this.filterParams.MaxPrice != null ? this.filterParams.MaxPrice : this.maxPrice.maxPrice],
          connect: true,
          direction: 'rtl',
          range: {
            'min': 0,
            'max': this.maxPrice.maxPrice
          }
        });
      }
    });
  }

  getFilterAttributes() {
    this.productService.getFilterAttributes(this.params.productGroupCode).subscribe(response => {
      this.filterAttributes = response.data;
    });
  }

  updatePageNumber(pageNumber: number) {
    this.page = pageNumber;
    this.generateUrl();
    this.getProductsListByFilter();
  }

  paginationCounter(size: number) {
    return new Array(size);
  }

  applyFilter() {
    this.showRemoveFilter = true;
    this.updatePageNumber(1);
  }

  changeHasInventory(event: any) {
    this.filterParams.HasInventory = event.target.checked ? true : null;

    this.applyFilter();
  }

  changeHasDifferentGrade(event: any) {
    this.filterParams.HasDifferentGrade = event.target.checked ? true : null;

    this.applyFilter();
  }

  changeSearchAttribute(event: any, name: string, value: string, multiSelect: boolean) {
    let itemIndex: number = this.filterParams.ProductFilterAttributeDtoList.findIndex(item => item.Name == name);
    switch (multiSelect) {
      case false:
        if (itemIndex == -1)
          this.filterParams.ProductFilterAttributeDtoList.push({ Name: name, Value: value });
        else {
          const selectedId = name + this.filterParams.ProductFilterAttributeDtoList[itemIndex].Value
          document.getElementById(selectedId)['checked'] = false;
          if (event.target.checked)
            this.filterParams.ProductFilterAttributeDtoList[itemIndex].Value = value;
          else
            this.filterParams.ProductFilterAttributeDtoList.splice(itemIndex, 1);
        }
        break;
      case true:
        if (itemIndex == -1)
          this.filterParams.ProductFilterAttributeDtoList.push({ Name: name, List: [value] });
        else {
          const valueIndex: number = this.filterParams.ProductFilterAttributeDtoList[itemIndex].List.indexOf(value);
          if (event.target.checked && valueIndex == -1)
            this.filterParams.ProductFilterAttributeDtoList[itemIndex].List.push(value);
          else {
            this.filterParams.ProductFilterAttributeDtoList[itemIndex].List.splice(valueIndex, 1);
          }
        }
        break;
    }

    this.applyFilter();
  }

  filterPriceRange(): void {
    const prices = this.priceRange.noUiSlider.get();

    this.filterParams.MinPrice = parseInt(prices[0]);
    this.filterParams.MaxPrice = parseInt(prices[1]);

    this.applyFilter();
  }

  resetFilters(pageNo: number): void {
    this.showRemoveFilter = false;

    this.filterParams.HasInventory = null;
    this.filterParams.HasDifferentGrade = null;
    this.filterParams.MaxPrice = null;
    this.filterParams.MinPrice = null;
    this.filterParams.ProductFilterAttributeDtoList = [];

    this.page = pageNo;
    this.params.PageNo = this.page;

    this.searchParam.PageNo = this.page;
    this.searchParam.ProductFilterListDto = this.filterParams;

    if (!this.isSearch && this.priceRange != undefined && this.maxPrice != undefined)
      this.priceRange.noUiSlider.set([0, this.maxPrice.maxPrice]);
  }

  changeSort(sortType: SortType): void {
    if (this.searchParam.SortType == sortType) return;
    this.searchParam.SortType = sortType;
    this.page = 1;
    this.getProductsListByFilter();
  }

  removeFilters(): void {
    this.showRemoveFilter = false;

    var checkBoxes = document.querySelectorAll('#searchable-attributes input[type="checkbox"]');
    checkBoxes.forEach(checkbox => {
      if (!checkbox['disabled'])
        checkbox['checked'] = false;
    });

    this.resetFilters(1);
    this.generateUrl();
    this.getProductsListByFilter();
  }

  @HostListener('window:resize', [])
  onResize() {
    this.windowSize = window.innerWidth;
    if (this.windowSize < 768 && this.compareList.length > 2) {
      this.compareList.splice(2);
    }
  }

  addToCompareList (event: IProduct, productComponent: ProductItemComponent) {
    if ((this.windowSize < 768 && this.compareList.length < 2) || (this.windowSize > 767 && this.compareList.length < 4)) {
      this.compareList.push(event);
      return;
    }
    this.toastService.showWarning('حداکثر تعداد محصول جهت مقایسه انتخاب شده است.');
    productComponent.isCompareSelected = false;
  }

  removeFromCompareList(index: number) {
    this.compareList.splice(index, 1);
  }

  toggleCompare(event: IProduct, productComponent: ProductItemComponent) {
    let index: number = this.compareList.findIndex(item => item.marketingProductId == event.marketingProductId);
    if (index == -1) this.addToCompareList(event, productComponent);
    else this.removeFromCompareList(index);
  }

  compareProducts(): void {
    let productModels: string[] = [];
    this.compareList.forEach(item => productModels.push(item.marketingProductModel));
    this.router.navigate(['/compare'], {
      queryParams: {
        productsModel: productModels.join(',')
      }
    });
  }

  isCompareSelected(id): boolean {
    return this.compareList.filter(item => item.marketingProductId === id).length === 1;
  }

  getIsChecked(name: string, value: string, multiSelect: boolean) {
    const filterItem = this.filterParams.ProductFilterAttributeDtoList.filter(item => item.Name == name);
    return filterItem.length == 0 ? false : multiSelect ? filterItem[0].List.indexOf(value) != -1 : filterItem[0].Value == value;
  }

  generateUrl() {
    if (!this.isBrowser) return;

    let params = {};
    if (this.page != 1)
      params['page'] = this.page;

    if (this.searchParam.SortType != SortType.CreatedOn)
      params['SortType'] = this.searchParam.SortType;

    if (this.searchParam.ProductFilterListDto.HasInventory)
      params['HasInventory'] = true;

    if (this.searchParam.ProductFilterListDto.HasDifferentGrade)
      params['HasDifferentGrade'] = true;

    if (this.searchParam.ProductFilterListDto.MinPrice != null)
      params['MinPrice'] = this.searchParam.ProductFilterListDto.MinPrice;
    if (this.searchParam.ProductFilterListDto.MaxPrice != null)
      params['MaxPrice'] = this.searchParam.ProductFilterListDto.MaxPrice;

    this.searchParam.ProductFilterListDto.ProductFilterAttributeDtoList.forEach(filterItem => {
      if (typeof filterItem.Value != 'undefined') {
        params[filterItem.Name] = filterItem.Value;
      } else {
        params[`${filterItem.Name}[]`] = filterItem.List.join('-');
      }
    });

    if (Object.keys(params).length == 0)
      this.showRemoveFilter = false;

    this.router.navigate([], {
      queryParams: params
    });
  }

  getFilterText(filterItem: IProductFilterItem) {
    return this.filterAttributes.filter(item => item.name == filterItem.Name)[0].attributeItemDtoList.filter(item => item.id == Number(filterItem.Value))[0].title;
  }

  getFilterListText(filterList: string, filterItem: IProductFilterItem) {
    return this.filterAttributes.filter(item => item.name == filterItem.Name)[0].attributeItemDtoList.filter(item => item.id == Number(filterList))[0].title;
  }

  removeFilterItem(name: string, value: string, multiSelect: boolean) {
    if (name == 'price') {
      this.filterParams.MaxPrice = null;
      this.filterParams.MinPrice = null;

    } else if (name == 'HasInventory') {
      this.filterParams.HasInventory = null;
    } else if (name == 'HasDifferentGrade') {
      this.filterParams.HasDifferentGrade = null;
    } else if (!multiSelect) {
      this.filterParams.ProductFilterAttributeDtoList.forEach((item, index) => {
        if (item.Name == name)
          this.filterParams.ProductFilterAttributeDtoList.splice(index, 1);
      });
    } else {
      this.filterParams.ProductFilterAttributeDtoList.forEach((item, index) => {
        if (item.Name == name) {
          this.filterParams.ProductFilterAttributeDtoList[index].List.forEach((child, j) => {
            if (child == value) {
              this.filterParams.ProductFilterAttributeDtoList[index].List.splice(j, 1);
              if (this.filterParams.ProductFilterAttributeDtoList[index].List.length == 0)
                this.filterParams.ProductFilterAttributeDtoList.splice(index, 1);
            }
          })
        }
      });
    }
    this.applyFilter();
  }
}
