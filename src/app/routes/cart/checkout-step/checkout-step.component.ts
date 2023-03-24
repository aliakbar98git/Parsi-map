import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faUser, faMapMarker, faCreditCard, faShoppingBasket } from '@fortawesome/free-solid-svg-icons';
import { UserService, UserType } from '../../user/shared';
import { CheckoutSteps } from '../shared/checkout-step.enum';

@Component({
  selector: 'app-checkout-step',
  templateUrl: './checkout-step.component.html',
  styleUrls: ['./checkout-step.component.scss']
})
export class CheckoutStepComponent implements OnInit {
  @Input() CheckoutStep: CheckoutSteps;
  @Input() invoiceKey: string = '';

  faUser = faUser;
  faMapMarker = faMapMarker;
  faCreditCard = faCreditCard;
  faShoppingBasket = faShoppingBasket;

  constructor(
    public userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public get userType(): typeof UserType {
    return UserType;
  }

  goCheckCustomer() {
    this.router.navigate(['/cart/check-customer']);
  }

  goShipping() {
    if (this.invoiceKey == null || this.invoiceKey == '') return;
    this.router.navigate(['/cart/shipping'], {
      queryParams: { invoiceKey: this.invoiceKey }
    });
  }
}
