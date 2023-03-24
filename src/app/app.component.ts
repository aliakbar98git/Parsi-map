import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from './routes/user/shared/user.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { IAddToCart, IUpdateCart, OrderService } from './routes/product';
import { Subscription } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  logInEventSubscription: Subscription;
  logOutEventSubscription: Subscription;
  isBrowser: boolean;

  constructor(
    private ngSelectConfig: NgSelectConfig,
    private userService: UserService,
    private orderService: OrderService,
    private storage: StorageMap,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.ngSelectConfig.notFoundText = 'موردی یافت نشد.';

    this.logInEventSubscription = this.orderService.getLogInEvent().subscribe(() => {
      this.updateCartOnLogIn();
    })
    this.logOutEventSubscription = this.orderService.getLogOutEvent().subscribe(() => {
      this.updateCartOnLogOut();
    })
  }

  ngOnInit(): void {
    if (this.isBrowser)
      this.userService.getCurrentUser().subscribe(response => {
        if (response.data != null && response.data.isAuthenticated) {
          this.userService.currentUser = response.data.user;
          this.userService.isAuthenticated = true
        }
        this.orderService.setCartQuantity();
      })
  }

  updateCartOnLogIn() {
    this.storage.get('cart').subscribe((cart: IAddToCart[]) => {
      if (cart == undefined) {
        this.orderService.setCartQuantity();
      } else {
        const param: IUpdateCart = {
          ForceMaximumOrderQuantity: true,
          List: cart
        };
        this.orderService.updateCart(param).subscribe(response => {
          this.orderService.updateCartQuantity(response.data.totalProductCount);
          this.storage.delete('cart').subscribe(() => { });
        });
      }
    });
  }

  updateCartOnLogOut() {
    this.orderService.setCartQuantity();
  }
}
