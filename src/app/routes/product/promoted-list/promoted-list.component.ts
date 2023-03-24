import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { IProductList, IProductListParam, ProductService } from '../shared';
import { LoadingService } from '@shared/.';
import { finalize } from 'rxjs/operators';

@Component({
  templateUrl: './promoted-list.component.html',
  styleUrls: ['./promoted-list.component.scss']
})
export class PromotedListComponent implements OnInit {
  data: IProductList;
  showLoading: boolean;
  params: IProductListParam = {
    PageNo: 1
  }

  constructor(
    private productService: ProductService,
    private viewportScroller: ViewportScroller,
    private loadingService: LoadingService,
    private title: Title
  ) { }


  ngOnInit(): void {
    this.title.setTitle('فروش‌های ویژه')
    this.getProductsList()
  }


  private getProductsList() {
    this.showLoading = true;
    this.productService.getPromotedProductsList(this.params)
      .pipe(finalize(() => { this.showLoading = false; this.loadingService.hideLoading(); }))
      .subscribe(response => {
        this.data = response.data;
        this.viewportScroller.scrollToAnchor("content-container");
      });
  }

  onPageChange() {
    this.loadingService.showLoading();
    this.getProductsList()
  }

}
