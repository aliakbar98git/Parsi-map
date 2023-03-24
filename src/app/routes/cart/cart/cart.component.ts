import { Component, OnInit } from '@angular/core';
import { faTimes, faAngleLeft, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { ToastService } from '@shared/toast/toast.service';
import { UserService } from './../../user/shared/user.service';
import { ICart, IDeleteFromCart, IOrderItem, CartService } from '../shared';
import { IUpdateCart, OrderService } from '../../product';
import { UserType } from '../../user/shared';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: ICart;
  payInfoVisible: boolean = false;
  faTimes = faTimes;
  faAngleLeft = faAngleLeft;
  faAngleDown = faAngleDown;

  constructor(
    private toastService: ToastService,
    private cartService: CartService,
    private orderService: OrderService,
    private userService: UserService,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('سبد خرید');
    this.getCart();
  }

  setCart(cart: ICart) {
    this.cart = cart;
    const cartQuantity: number = cart == null ? 0 : cart.totalProductCount;
    this.orderService.updateCartQuantity(cartQuantity);
  }

  getCart() {
    this.cartService.getCart().subscribe(response => {
      this.setCart(response.data)
    })
  }

  getQuantity(size: number) {
    return new Array(size);
  }

  deleteAllCart() {
    this.cartService.deleteAllCart().subscribe(response => {
      this.setCart(response.data)
    })
  }

  deleteFromCart(item: IOrderItem) {
    const param: IDeleteFromCart = { Id: item.id };
    this.cartService.deleteFromCart(param).subscribe(response => {
      this.setCart(response.data)
    })
  }

  updateCart(event: any, item: IOrderItem) {
    const param: IUpdateCart = {
      ForceMaximumOrderQuantity: false,
      List: [{ ProductId: item.marketingProductId, Quantity: parseInt(event.target.value) }]
    };
    this.orderService.updateCart(param).subscribe(response => {
      this.setCart(response.data)
    }, (error) => {
      event.target.value = item.quantity;
      this.updateCart(event, item);
    }
    )
  }

  goNextStep() {
    if (this.userService.currentUser.userType == UserType.Consumer)
      this.router.navigate(['/cart/shipping']);
    else if (this.userService.currentUser.userType == UserType.Seller)
      this.router.navigate(['/cart/check-customer']);
    else
      this.toastService.showWarning('شما مجاز به ادامه فرآیند نیستید.');
  }
}
