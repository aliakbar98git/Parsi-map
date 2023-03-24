import { Injectable, NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UrlSerializer } from '@angular/router';
import { NgxMaskModule } from 'ngx-mask';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import * as Hammer from '@squadette/hammerjs';
import { HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent, FooterComponent, HeaderComponent, NavComponent } from './layout';
import {
  ProductItemComponent,
  ProductListComponent,
  PromotedListComponent,
  ProductDetailComponent,
  CompareComponent,
  ProductStarComponent,
  ProductSearchAccordionComponent,
  ProductPriceHistoryComponent,
  ProductRibbonComponent,
  ProductShareComponent,
  NotifyMeComponent
} from './routes/product';
import { PageNotFoundComponent } from './routes/errors';

import { ProductService } from './routes/product';
import { OrderService } from './routes/product';
import { UserService } from './routes/user/shared';

import { SharedModule } from './shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ResponseIntercept } from './shared/_interceptors/response.interceptor';
import { BreadcrumbComponent } from '@shared/breadcrumb/breadcrumb.component';
import { CredentialsInterceptor } from '@shared/_interceptors/credentials.interceptor';
import { PagesComponent } from './routes/pages/pages.component';
import { ProductGalleryComponent } from './routes/product/product-gallery/product-gallery.component';
import { HomeComponent } from './routes/home/home/home.component';
import { ContactUsComponent } from './routes/contact-us/contact-us.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { LowerCaseUrlSerializer } from '@shared/_urlSerializer/lowerCaseUrlSerializer';
import { OrganizationalSaleComponent } from './routes/organizational-sale/organizational-sale.component';
import { UnderConstructionComponent } from './routes/under-construction/under-construction.component';
import { WorldCupComponent } from './routes/world-cup/world-cup.component';

@Injectable()
export class HammerConfig extends HammerGestureConfig {
  overrides = <any>{
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    HomeComponent,
    PageNotFoundComponent,
    UnderConstructionComponent,
    ProductListComponent,
    ProductItemComponent,
    ProductDetailComponent,
    ProductStarComponent,
    ProductSearchAccordionComponent,
    PromotedListComponent,
    CompareComponent,
    BreadcrumbComponent,
    ProductPriceHistoryComponent,
    PagesComponent,
    ProductGalleryComponent,
    ProductRibbonComponent,
    ContactUsComponent,
    ProductShareComponent,
    OrganizationalSaleComponent,
    NotifyMeComponent,
    WorldCupComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserTransferStateModule,
    NgxMaskModule.forRoot(),
    NgbModule,
    SlickCarouselModule,
    NgSelectModule,
    HammerModule
  ],
  providers: [
    UserService,
    ProductService,
    OrderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseIntercept,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CredentialsInterceptor,
      multi: true
    },
    {
      provide: UrlSerializer,
      useClass: LowerCaseUrlSerializer
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
