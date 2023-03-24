import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject, PLATFORM_ID, ViewChild, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '@environments/environment';
import { forkJoin, Observable, UnsubscriptionError } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { ProductService, IHomePageProducts } from '../../product';
import { AdvertisementType, IAd, SliderAd } from '../shared';
import { UserService, UserType } from '../../user/shared';
import { IResponse } from '@shared/.';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  homeProducts: IHomePageProducts;
  homeSlidersAds: SliderAd;
  wideAd: IAd;
  narrowAd: IAd;
  productsSliderConfig: object;
  shrinkProductsSliderConfig: object;
  topSliderConfig: object;
  showLoading: boolean;
  userType: typeof UserType;
  isBrowser: boolean;
  sliderIndex: number;
  isSeller = false;
  currentUserSubject;
  @ViewChild('slickModal') slickModal: SlickCarouselComponent;

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private title: Title,
    private metaService: Meta,
    public userService: UserService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.sliderIndex = 0;
  }

  ngOnInit(): void {
    this.title.setTitle('فروشگاه اینترنتی گلدیران پلاس');

    this.metaService.addTags([
      { name: 'robots', content: 'index, follow' },
      { name: 'description', content: 'خرید آنلاین محصولات جی پلاس، لوازم خانگی، یخچال ساید بای ساید، ماشین ظرفشویی، تلویزیون، کولر، موبایل و مانیتور با گارانتی گلدیران' },
      { name: 'keywords', content: 'گلدیران پلاس,لوازم خانگی,صوتی تصویری,الجی, الجی,گلدیران,یخچال,کولر,تلویزیون' }]);
    this.userType = UserType;
    if (this.userService.currentUser) {
      this.isSeller = this.userService.currentUser.userType === UserType.Seller ? true : false;
    }
    this.currentUserSubject = this.userService.currentUserSubject.subscribe((data: any) => {
      if (data) {
        this.isSeller = this.userService.currentUser.userType === UserType.Seller ? true : false;
      }else {
        this.isSeller = false;
      }
      
    });


    this.getHomePageData();
    if (this.isBrowser)
      this.setupSliders();



  }
  ngOnDestroy(): void {
    this.currentUserSubject.unsubscribe();
  }
  getHomePageData() {
    this.showLoading = true;
    forkJoin({
      homeProducts: this.productService.getHomePageProducts(),
      homeSlidersAds: this.getHomeSlidesAds()
    })
      .pipe(finalize(() => this.showLoading = false))
      .subscribe(
        response => {
          this.extractAds(response.homeSlidersAds.data.advertisements);
          this.homeProducts = response.homeProducts.data;
          this.homeSlidersAds = response.homeSlidersAds.data;
          if (this.isBrowser)
            this.sliderTimer(0);
        }
      )
  }

  sliderTimer(duration: number) {
    setTimeout(() => {
      if (duration !== 0 && this.slickModal != undefined) this.slickModal.slickNext();
      if (this.sliderIndex >= this.homeSlidersAds.slider.length) this.sliderIndex = 0;
      this.sliderTimer(this.homeSlidersAds.slider[this.sliderIndex++].showingDuration);
    }, duration * 1000);
  }

  private getHomeSlidesAds(): Observable<IResponse<SliderAd>> {
    return this.http.get<IResponse<SliderAd>>(`${environment.apiUrl}/marketingproduct/getsliderandadvertisement`);
  }

  private extractAds(ads: IAd[]) {
    for (let item of ads) {
      switch (item.advertisementType) {
        case AdvertisementType.Small:
          this.narrowAd = item;
          break;
        case AdvertisementType.Large:
          this.wideAd = item;
          break;
      }
    }
  }

  private setupSliders() {
    this.productsSliderConfig = {
      "slidesToShow": 4,
      "slidesToScroll": 1,
      "rtl": true,
      "prevArrow": `<div class="slick-prev slick-arrow"><svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-right" class="svg-inline--fa fa-caret-right fa-w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path fill="currentColor" d="M0 384.662V127.338c0-17.818 21.543-26.741 34.142-14.142l128.662 128.662c7.81 7.81 7.81 20.474 0 28.284L34.142 398.804C21.543 411.404 0 402.48 0 384.662z"></path></svg></div>`,
      "nextArrow": `<div class="slick-next slick-arrow"><svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-left" class="svg-inline--fa fa-caret-left fa-w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path fill="currentColor" d="M192 127.338v257.324c0 17.818-21.543 26.741-34.142 14.142L29.196 270.142c-7.81-7.81-7.81-20.474 0-28.284l128.662-128.662c12.599-12.6 34.142-3.676 34.142 14.142z"></path></svg></div>`,
      "responsive": [
        {
          "breakpoint": 1200,
          "settings": {
            "slidesToShow": 3
          }
        },
        {
          "breakpoint": 992,
          "settings": {
            "slidesToShow": 2
          }
        },
        {
          "breakpoint": 576,
          "settings": {
            "slidesToShow": 1
          }
        }
      ]
    };
    this.shrinkProductsSliderConfig = {
      "slidesToShow": 3,
      "slidesToScroll": 1,
      "rtl": true,
      "prevArrow": `<div class="slick-prev slick-arrow"><svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-right" class="svg-inline--fa fa-caret-right fa-w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path fill="currentColor" d="M0 384.662V127.338c0-17.818 21.543-26.741 34.142-14.142l128.662 128.662c7.81 7.81 7.81 20.474 0 28.284L34.142 398.804C21.543 411.404 0 402.48 0 384.662z"></path></svg></div>`,
      "nextArrow": `<div class="slick-next slick-arrow"><svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-left" class="svg-inline--fa fa-caret-left fa-w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path fill="currentColor" d="M192 127.338v257.324c0 17.818-21.543 26.741-34.142 14.142L29.196 270.142c-7.81-7.81-7.81-20.474 0-28.284l128.662-128.662c12.599-12.6 34.142-3.676 34.142 14.142z"></path></svg></div>`,
      "responsive": [
        {
          "breakpoint": 1200,
          "settings": {
            "slidesToShow": 2
          }
        },
        {
          "breakpoint": 992,
          "settings": {
            "slidesToShow": 1
          }
        }
      ]
    };
    this.topSliderConfig = {
      "slidesToShow": 1,
      "slidesToScroll": 1,
      "fade": true,
      "cssEase": 'linear',
      "infinite": true,
      "rtl": true,
      "prevArrow": `<div class="slick-prev slick-arrow"><svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-right" class="svg-inline--fa fa-caret-right fa-w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path fill="currentColor" d="M0 384.662V127.338c0-17.818 21.543-26.741 34.142-14.142l128.662 128.662c7.81 7.81 7.81 20.474 0 28.284L34.142 398.804C21.543 411.404 0 402.48 0 384.662z"></path></svg></div>`,
      "nextArrow": `<div class="slick-next slick-arrow"><svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-left" class="svg-inline--fa fa-caret-left fa-w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path fill="currentColor" d="M192 127.338v257.324c0 17.818-21.543 26.741-34.142 14.142L29.196 270.142c-7.81-7.81-7.81-20.474 0-28.284l128.662-128.662c12.599-12.6 34.142-3.676 34.142 14.142z"></path></svg></div>`
    };
  }
}
