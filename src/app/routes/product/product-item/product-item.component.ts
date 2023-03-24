import { isPlatformBrowser } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { faBalanceScale } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { IProduct } from './../shared/product.model';
import { UserService } from '../../user/shared/user.service';
import { UserType } from '../../user/shared';
import { IAddToCart } from '..';
import { OrderService } from '../shared/order.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {
  @Input() product: IProduct;
  @Input() extraClass: string;
  @Input() comparable: boolean = false;
  @Input() @Optional() isCompareSelected: boolean = false;
  @Output() toggleCompare = new EventEmitter<IProduct>();

  REMAIN_DAYS: number = 10;
  SECOND: number = 1000
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
  ribbonsList: string[] = [];
  userType: typeof UserType;
  isBrowser: boolean;
  faBalanceScale = faBalanceScale;
  faClock = faClock;

  constructor(
    public userService: UserService,
    private orderService: OrderService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.userType = UserType;
    if (this.product.ribbonList) this.ribbonsList = this.product.ribbonList;
    if (!this.product.hasInventory) this.ribbonsList.push('no-inventory');
    if (this.product.promotionEndDate != null && this.isBrowser) {
      this.hasPromotion = true;
      this.endDateTime = new Date(this.product.promotionEndDate.replace('T', ' ')).getTime()

      this.countDown();

      const source = interval(this.SECOND);
      this.subscription = source.subscribe(() => this.countDown());
    }
  }

  ngOnDestroy() {
    if (this.product != null && this.product.promotionEndDate != null && this.isBrowser) {
      this.subscription && this.subscription.unsubscribe();
    }
  }

  countDown() {
    let now = new Date().getTime(),
      distance = this.endDateTime - now;

    this.remainDay = Math.floor(distance / (this.DAY));
    this.remainHour = Math.floor((distance % (this.DAY)) / (this.HOUR));
    this.remainMin = Math.floor((distance % (this.HOUR)) / (this.MINUTE));
    this.remainSec = Math.floor((distance % (this.MINUTE)) / this.SECOND);

    if (distance < 0) {
      this.subscription && this.subscription.unsubscribe();
      this.hasPromotion = false;
    }
  }

  showCountdown(): boolean {
    return this.remainDay < this.REMAIN_DAYS && this.product.hasInventory ? true : false
  }

  compare(): void {
    this.isCompareSelected = !this.isCompareSelected;
    this.toggleCompare.next(this.product);
  }

  addToCart() {
    const cartItem: IAddToCart = {
      ProductId: this.product.marketingProductId,
      Quantity: 1
    }
    this.orderService.addToCart(cartItem).subscribe();
  }
}
