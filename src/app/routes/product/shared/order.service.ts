import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { environment } from '@environments/environment';
import { StorageMap } from '@ngx-pwa/local-storage';
import { IAddToCart, IUpdateCart } from './order.model';
import { IResponse, LoadingService } from '@shared/.';
import { UserService } from '../../user/shared';
import { ICart } from '../../cart/shared';


@Injectable()
export class OrderService {
  private cartQuantity: number = 0;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private logInSubject = new Subject<any>();
  private logOutSubject = new Subject<any>();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private userService: UserService,
    private storage: StorageMap,
  ) { }


  sendLogInEvent() {
    this.logInSubject.next();
  }

  getLogInEvent(): Observable<any> {
    return this.logInSubject.asObservable();
  }

  sendLogOutEvent() {
    this.logOutSubject.next();
  }

  getLogOutEvent(): Observable<any> {
    return this.logOutSubject.asObservable();
  }

  getCartQuantity(): number {
    return this.cartQuantity;
  }

  setCartQuantity(): void {
    if (this.userService.getIsAuthenticated()) {
      this.http.get<IResponse>(`${environment.apiUrl}/OrderInfo/GetCartTotalProductsCount`, {}).subscribe(response => {
        this.updateCartQuantity(response.data.productsCount);
      });
    } else {
      this.storage.get('cart').subscribe((cart: IAddToCart[]) => {
        const totalQuantity: number = cart == undefined ? 0 : cart.map(x => x.Quantity).reduce((prev, curr) => prev + curr, 0);
        this.updateCartQuantity(totalQuantity);
      });
    }
  }

  updateCartQuantity(quantity: number): void {
    this.cartQuantity = quantity;
  }

  addToCart(params: IAddToCart) {
    this.loadingService.showLoading();
    return this.http.post<IResponse>(`${environment.apiUrl}/OrderInfo/AddToCart`, params, this.httpOptions)
      .pipe(tap(response => this.updateCartQuantity(response.data.productsCount)));
  }

  updateCart(params: IUpdateCart) {
    this.loadingService.showLoading();
    return this.http.post<IResponse<ICart>>(`${environment.apiUrl}/OrderInfo/UpdateCart`, params, this.httpOptions);
  }
}
