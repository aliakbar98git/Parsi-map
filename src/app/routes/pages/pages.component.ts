import { IPage } from './../../shared/_interfaces/pages';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PagesService } from '@shared/_services/pages.service';

@Component({
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
  pageName: string;
  pageData: IPage;

  constructor(
    private activeRoute: ActivatedRoute,
    private pagesService: PagesService
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((routeParams) => {
      this.pageName = routeParams.name;
      this.pageData = undefined;
      this.getPageContent();
    });
  }

  getPageContent() {
    this.pagesService.getPageDetail(this.pageName).subscribe(response => {
      this.pageData = response.data;
    }, () => {
      this.pageData = {
        title: 'خطا در دریافت اطلاعات',
        pageContent: '<div class="alert alert-warning">متاسفانه خطایی در دریافت اطلاعات صفحه رخ داده است. لطفا آدرس صفحه را بررسی نمایید. در صورت صحیح بودن آدرس لطفا مجدد تلاش نمایید.</div>'
      }
    })
  }
}
