import { IComparableParam, IComparableProduct } from './../shared/product.model';
import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faTimes, faCheck, faAngleLeft, faPlusSquare } from '@fortawesome/free-solid-svg-icons';


import { IAttributeContainer, IAttributeItem, ICompareList, ICompareProduct, ProductService } from '../shared';
import { Subscription } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit {
  isBrowser: boolean;
  products: ICompareProduct[];
  productsModel: ICompareList = {
    ProductModelList: []
  }
  faTimes = faTimes;
  faCheck = faCheck;
  faAngleLeft = faAngleLeft;
  faPlusSquare = faPlusSquare;

  compareParams: IComparableParam = {
    ProductIdList: [],
    Keyword: ''
  }
  comparableProducts: IComparableProduct[];
  showAddToCompare: boolean;
  subscription: Subscription;
  timer: number;

  constructor(
    private activeRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private modalService: NgbModal,
    @Inject(PLATFORM_ID) platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((routeParams) => {
      this.productsModel.ProductModelList = typeof routeParams.productsModel == 'string' ? routeParams.productsModel.split(',') : routeParams.productsModel;

      this.products = undefined
      this.compareProducts()
    })
  }

  @HostListener('window:resize', [])
  onResize() {
    const windowSize = window.innerWidth;
    if (windowSize < 768 && this.productsModel.ProductModelList.length > 2) {
      this.productsModel.ProductModelList.splice(2);
      this.router.navigate(['/compare'], {
        queryParams: {
          productsModel: this.productsModel.ProductModelList.join(',')
        }
      });
    } else {
      this.checkCompareList();
    }
  }
  
  checkCompareList() {
    const windowSize = window.innerWidth;
    if ((windowSize < 768 && this.productsModel.ProductModelList.length < 2) ||
        (windowSize > 767 && this.productsModel.ProductModelList.length < 4)) {
      this.showAddToCompare = true;
    } else {
      this.showAddToCompare = false;
    }
  }

  compareProducts() {
    this.productService.compareProducts(this.productsModel).subscribe(response => {
      if (this.isBrowser) this.checkCompareList();
      this.products = response.data;
    })
  }

  getContainers() {
    let containers: IAttributeContainer[] = [];
    if (this.products.length == 0) return containers;
    this.products[0].attributes.forEach(item => containers.push({
      containerTitle: item.containerTitle,
      containerId: item.containerId
    }))
    return containers;
  }

  getAttributeTitles(containerIndex: number) {
    let titles: IAttributeItem[] = [];
    this.products[0].attributes[containerIndex].attributeList.forEach(item => titles.push({
      label: item.label
    }))
    return titles;
  }

  getAttributeValues(containerIndex: number, attributeIndex: number) {
    let values: IAttributeItem[] = [];
    this.products.forEach(item => {
      const attributeItem = item.attributes[containerIndex].attributeList[attributeIndex];

      values.push({
        goodsAttributeItemTitle: attributeItem.goodsAttributeItemTitle,
        goodsAttributeValue: attributeItem.goodsAttributeValue,
        goodAttributeType: attributeItem.goodAttributeType
      })
    });
    return values;
  }

  removeFromCompare(productModel: string) {
    this.router.navigate(['/compare'], {
      queryParams: {
        productsModel: this.productsModel.ProductModelList.filter(x => x != productModel).join(',')
      }
    });
  }

  addToCompare(productModel: string) {
    this.modalService.dismissAll();
    if (!this.showAddToCompare) return;
    this.productsModel.ProductModelList.push(productModel)
    this.comparableProducts = undefined;
    this.router.navigate(['/compare'], {
      queryParams: {
        productsModel: this.productsModel.ProductModelList.join(',')
      }
    });
  }

  openAddModal(content: any) {
    this.modalService.open(content, {
      centered: true,
      size: 'lg',
      windowClass: 'compare-add'
    });

    this.getComparableProducts();
  }

  getComparableProducts(keyword?: string) {
    if (keyword != undefined && keyword != '') {
      clearTimeout(this.timer);
      if (keyword.length < 3) return;
      if (this.subscription != undefined)
        this.subscription.unsubscribe();
    }

    this.timer = window.setTimeout(() => {
      this.comparableProducts = undefined;
      this.compareParams.Keyword = keyword != undefined ? keyword : '';
      this.compareParams.ProductIdList = [];
      this.products.forEach(item => {
        this.compareParams.ProductIdList.push(item.marketingProductId);
      })

      this.subscription = this.productService.getComparableProducts(this.compareParams).subscribe(response => {
        this.comparableProducts = response.data;
      })
    }, 800);
  }
}
