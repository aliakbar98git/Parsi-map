import { ActivatedRoute } from '@angular/router';
import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  HostListener,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Subscription, interval } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StorageMap } from '@ngx-pwa/local-storage';
import { finalize } from 'rxjs/operators';
import { environment } from '@environments/environment';
import {
  faHeart,
  faShareAlt,
  faChartArea,
  faBalanceScale,
  faEllipsisH,
  faInfoCircle,
  faCartPlus,
  faGlasses,
  faComments,
  faList,
  faCaretDown,
  faCheck,
  faTimes,
  faStar,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import {
  ProductService,
  IProductComment,
  IComment,
  IProductDetail,
  OrderService,
  IPriceHistoryParam,
  IBreadcrumb,
  IBreadcrumbProductList,
} from '../shared';
import { IAddToCart } from './../shared/order.model';
import { UserService, UserType } from '../../user/shared';
import { FavoriteProductToggle, SharedService } from '@shared/.';
import { ToastService } from '@shared/toast/toast.service';
import { ProductPriceHistoryComponent } from '../product-price-history/product-price-history.component';
import { ColorCode } from './../../../shared/_interfaces/color';
import { ProductGalleryComponent } from '../product-gallery/product-gallery.component';
import { Meta, Title } from '@angular/platform-browser';
import { ProductShareComponent } from '../product-share/product-share.component';
import { Color } from '@shared/_enums/color.enum';

@Component({
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  data: IProductDetail;
  breadcrumbs: IBreadcrumb[] = [];
  productModel: string;
  showMoreAttribute: boolean = false;
  commentForm: FormGroup;
  comments: IProductComment[] = null;
  commentRate: number = 0;
  commentRateOver: number = 0;
  commentSubmitted: boolean = false;
  activeTab: number = 1;
  priceHistoryModalRef: any;
  isGiSeller: boolean = false;

  faHeart = faHeart;
  faChartArea = faChartArea;
  faBalanceScale = faBalanceScale;
  faEllipsisH = faEllipsisH;
  faInfoCircle = faInfoCircle;
  faCartPlus = faCartPlus;
  faGlasses = faGlasses;
  faComments = faComments;
  faList = faList;
  faCaretDown = faCaretDown;
  faCheck = faCheck;
  faTimes = faTimes;
  faStar = faStar;
  faShareAlt = faShareAlt;
  faPlay = faPlay;

  REMAIN_DAYS: number = 10;
  SECOND: number = 1000;
  MINUTE: number = this.SECOND * 60;
  HOUR: number = this.MINUTE * 60;
  DAY: number = this.HOUR * 24;

  endDateTime: number;
  remainDay: number;
  remainHour: number;
  remainMin: number;
  remainSec: number;
  hasPromotion: boolean = false;
  subscription: Subscription;

  ColorCode = ColorCode;
  galleryModalRef: any;

  userType: typeof UserType;
  showLoading: boolean;
  isBrowser: boolean;
  moreThumbImgIndex: number;
  colorName: typeof Color;

  constructor(
    private activeRoute: ActivatedRoute,
    private productService: ProductService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    public userService: UserService,
    private sharedService: SharedService,
    private storage: StorageMap,
    private toastService: ToastService,
    private orderService: OrderService,
    private metaService: Meta,
    private titleService: Title,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.userType = UserType;
    this.colorName = Color;
    this.commentForm = this.formBuilder.group({
      commentText: new FormControl('', Validators.required),
      commentRate: new FormControl('', Validators.required),
    });

    this.activeRoute.params.subscribe((routeParams) => {
      this.productModel = routeParams.model;
      this.data = undefined;
      this.breadcrumbs = [];
      this.comments = null;
      this.activeTab = 1;
      this.getProduct();
      this.getBreadcrumbs();
      this.getSEOInfo();
    });

    if (this.isBrowser) this.isGiSeller = environment.isSellerSite;
  }

  ngOnDestroy() {
    if (
      this.data != null &&
      this.data.product.promotionEndDate != null &&
      this.isBrowser
    ) {
      this.subscription && this.subscription.unsubscribe();
    }
  }

  get f() {
    return this.commentForm.controls;
  }

  getProduct() {
    this.showLoading = true;
    if (this.hasPromotion) {
      this.subscription && this.subscription.unsubscribe();
      this.hasPromotion = false;
    }
    this.productService
      .getProductItem(this.productModel)
      .pipe(finalize(() => (this.showLoading = false)))
      .subscribe((response) => {
        this.data = response.data;
        if (this.isBrowser) this.detectScreenSize();
        this.titleService.setTitle(
          `مشخصات، قیمت و خرید ${this.data.product.marketingProductName}`
        );
        if (
          this.data.product.description == null ||
          this.data.product.description == ''
        )
          this.activeTab = 2;

        if (this.data.product.promotionEndDate != null && this.isBrowser) {
          this.hasPromotion = true;
          this.endDateTime = new Date(
            this.data.product.promotionEndDate.replace('T', ' ')
          ).getTime();

          this.countDown();

          const source = interval(this.SECOND);
          this.subscription = source.subscribe((val) => this.countDown());
        }

        if (
          this.data.product.videoUrl &&
          !this.data.marketingProductAttachments[0].isVideo
        ) {
          this.data.marketingProductAttachments.unshift({
            documentInfoId: this.data.product.documentInfoId,
            documentName: this.data.product.videoUrl,
            imageType: this.data.product.imageType,
            isVideo: true,
          });
        }
      });
  }

  getBreadcrumbs() {
    this.productService
      .getProductBreadcrumbs(this.productModel)
      .subscribe((response) => {
        const breadcrumb: IBreadcrumb[] = [];
        response.data.forEach((item: IBreadcrumbProductList) =>
          breadcrumb.push({ title: item.title, url: `/category/${item.code}` })
        );
        this.breadcrumbs = breadcrumb;
      });
  }

  countDown() {
    let now = new Date().getTime(),
      distance = this.endDateTime - now;

    this.remainDay = Math.floor(distance / this.DAY);
    this.remainHour = Math.floor((distance % this.DAY) / this.HOUR);
    this.remainMin = Math.floor((distance % this.HOUR) / this.MINUTE);
    this.remainSec = Math.floor((distance % this.MINUTE) / this.SECOND);

    if (distance < 0) {
      this.subscription && this.subscription.unsubscribe();
      this.hasPromotion = false;
    }
  }

  showCountdown(): boolean {
    return this.remainDay < this.REMAIN_DAYS && this.data.product.hasInventory
      ? true
      : false;
  }

  toggleAttribute() {
    this.showMoreAttribute = !this.showMoreAttribute;
  }

  getComments() {
    if (this.activeTab != 3 || this.comments != null) return;

    this.productService
      .getProductComments(this.data.product.marketingProductId)
      .subscribe((response) => {
        this.comments = response.data;
      });
  }

  submitComment(formValues) {
    if (this.commentForm.invalid) return;

    const comment: IComment = {
      Comment: formValues.commentText,
      Score: formValues.commentRate,
      MarketingProductId: this.data.product.marketingProductId,
    };
    this.productService.createProductComment(comment).subscribe((response) => {
      if (response != null) this.commentSubmitted = true;
    });
  }

  getUsersComments() {
    return this.comments.filter((item) => item.referenceId == null);
  }

  getCommentAnswer(commentId: string) {
    return this.comments.filter((item) => item.referenceId == commentId);
  }

  updateCommentRate(rate: number) {
    this.commentRate = rate;
    this.commentForm.controls.commentRate.setValue(rate);
  }

  getCommentRateStarStatus(rate: number) {
    return rate <= this.commentRate ? true : false;
  }

  getCommentRateStarOver(rate: number) {
    return rate <= this.commentRateOver ? true : false;
  }

  favoriteToggle(): void {
    const item: FavoriteProductToggle = {
      marketingProductId: this.data.product.marketingProductId,
    };
    this.sharedService.toggleFavoriteItem(item).subscribe(() => {
      this.data.favoriteStatus = !this.data.favoriteStatus;
    });
  }

  addToCart(): void {
    const cartItem: IAddToCart = {
      ProductId: this.data.product.marketingProductId,
      Quantity: 1,
    };
    if (this.userService.currentUser != null) {
      this.orderService.addToCart(cartItem).subscribe();
    } else {
      this.storage.get('cart').subscribe({
        next: (cart: IAddToCart[]) => {
          if (cart == undefined) {
            cart = [cartItem];
          } else {
            const index = cart.findIndex(
              (x) => x.ProductId == cartItem.ProductId
            );
            if (index == -1) {
              cart.push(cartItem);
            } else {
              cart[index].Quantity += cartItem.Quantity;
            }
          }
          this.storage.set('cart', cart).subscribe({
            next: () => {
              this.toastService.showSuccess(
                `"${this.data.product.marketingProductName}" به سبد خرید اضافه شد.`
              );
              const totalQuantity: number = cart
                .map((x) => x.Quantity)
                .reduce((prev, curr) => prev + curr, 0);
              this.orderService.updateCartQuantity(totalQuantity);
            },
            error: () => {
              this.toastService.showWarning('لطفا وارد حساب کاربری خود شوید.');
            },
          });
        },
        error: () => {
          this.toastService.showWarning('لطفا وارد حساب کاربری خود شوید.');
        },
      });
    }
  }

  showShareModal() {
    const productShareModalRef = this.modalService.open(ProductShareComponent, {
      centered: true,
    });
    productShareModalRef.componentInstance.productModel =
      this.data.product.marketingProductModel;
  }

  showPriceHistory() {
    const item: IPriceHistoryParam = {
      MarketingProductId: this.data.product.marketingProductId,
    };
    this.productService.getPriceHistory(item).subscribe((response) => {
      if (
        response.data.productPriceHistoryList == null ||
        response.data.productPriceHistoryList.length <= 1
      ) {
        this.toastService.showInfo(
          `تغییر قیمتی در ${response.data.monthCountDiff} ماه گذشته ثبت نشده است.`
        );
      } else {
        this.priceHistoryModalRef = this.modalService.open(
          ProductPriceHistoryComponent,
          { centered: true, size: 'lg' }
        );
        this.priceHistoryModalRef.componentInstance.productPrices =
          response.data;
        this.priceHistoryModalRef.componentInstance.productName =
          this.data.product.marketingProductName;
      }
    });
  }

  showGallery() {
    this.galleryModalRef = this.modalService.open(ProductGalleryComponent, {
      centered: true,
      size: 'xl',
      scrollable: true,
      container: '.product-detail',
      windowClass: 'gallery-modal',
    });
    this.galleryModalRef.componentInstance.images =
      this.data.marketingProductAttachments;
  }

  getSEOInfo() {
    this.productService.getSEOInfo(this.productModel).subscribe((response) => {
      const responseData = response.data;
      const tags = [{ name: 'robots', content: 'index, follow' }];
      if (responseData.keyWord != null)
        tags.push({ name: 'keywords', content: responseData.keyWord });
      if (responseData.metaData != null)
        tags.push({ name: 'description', content: responseData.metaData });

      this.metaService.addTags(tags);
    });
  }

  @HostListener('window:resize', [])
  onResize() {
    this.detectScreenSize();
  }

  private detectScreenSize() {
    if (window.innerWidth > 1299) {
      this.moreThumbImgIndex =
        this.data.marketingProductAttachments.length > 4 ? 3 : null;
    } else {
      this.moreThumbImgIndex =
        this.data.marketingProductAttachments.length > 3 ? 2 : null;
    }
  }
}
