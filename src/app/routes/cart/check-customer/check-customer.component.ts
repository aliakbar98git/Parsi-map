import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  faAngleDown,
  faAngleLeft,
  faLongArrowAltLeft,
  faLongArrowAltRight,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { ToastService } from './../../../shared/toast/toast.service';
import { CartService, ICart } from '../shared';
import { CheckoutSteps } from '../shared/checkout-step.enum';
import { PersonType, UserService } from '../../user/shared';
import {
  ISetCustomerInfoParams,
  IUpdateNationalCodeParams,
  ICustomer,
} from './../shared/cart.model';
import { Global } from '@shared/.';
import { RegisterCustomerComponent } from '../register-customer/register-customer.component';
import { LegalPersonalInfoComponent } from './../../profile/legal-personal-info/legal-personal-info.component';
import { RealPersonalInfoComponent } from './../../profile/real-personal-info/real-personal-info.component';
import { ConfirmMobileNumberComponent } from '../../user/confirm-mobile-number/confirm-mobile-number.component';

@Component({
  templateUrl: './check-customer.component.html',
  styleUrls: ['./check-customer.component.scss'],
})
export class CheckCustomerComponent implements OnInit {
  cart: ICart;
  global = Global;
  userParentId: any;
  keyword: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  isForeign: FormControl = new FormControl(false);
  newNationalCode: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  payInfoVisible: boolean = false;
  customers: ICustomer[];
  customerSelected: ICustomer;
  faAngleLeft = faAngleLeft;
  faAngleDown = faAngleDown;
  faLongArrowAltLeft = faLongArrowAltLeft;
  faLongArrowAltRight = faLongArrowAltRight;
  faSearch = faSearch;
  registerCustomerModalRef;

  constructor(
    private cartService: CartService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private title: Title,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.title.setTitle('تخصیص خریدار');
    this.getCart();
  }

  public get checkoutSteps(): typeof CheckoutSteps {
    return CheckoutSteps;
  }

  public get personType(): typeof PersonType {
    return PersonType;
  }

  getCart() {
    this.cartService.getCart().subscribe((response) => {
      this.cart = response.data;
    });
  }

  checkCustomer() {
    if (this.keyword.invalid) return;
    this.customers = undefined;
    this.cartService.checkCustomer(this.keyword.value).subscribe((response) => {
      this.customers = response.data;
    });
  }

  confirmMobileNum() {
    this.registerCustomerModalRef = this.modalService.open(
      ConfirmMobileNumberComponent,
      { size: 'lg', centered: true, backdrop: 'static', scrollable: true }
    );
    this.registerCustomerModalRef.componentInstance.userId =
      this.customerSelected.userId;
      this.registerCustomerModalRef.componentInstance.confirmationCode =
      this.customerSelected.confirmationCode;
  }

  selectCustomer(customer: ICustomer) {
    if (
      !customer.nationalCodeIsValidate &&
      customer.personType == PersonType.RealPerson
    ) {
      this.toastService.showDanger(
        'کدملی نامعتبر است. لطفا کدملی را بروزرسانی نمایید.'
      );
      return;
    }

    this.customerSelected = customer;
    if (!customer.isMobileNumberConfirmed) {
      this.confirmMobileNum();
    }
  }

  changeCustomer() {
    this.customerSelected = undefined;
  }

  updateNationalCode(customer: ICustomer, index: number) {
    if (this.newNationalCode.invalid) return;

    const params: IUpdateNationalCodeParams = {
      RealPersonId: customer.customerId,
      NationalCode: this.newNationalCode.value,
      IsForeign: this.isForeign.value,
    };
    this.cartService
      .updateRealPersonNationalCode(params)
      .subscribe((response) => {
        customer.nationalCode = params.NationalCode;
        customer.nationalCodeIsValidate = true;
        this.customers[index] = customer;
        this.selectCustomer(customer);
      });
  }

  createCustomer() {
    this.registerCustomerModalRef = this.modalService.open(
      RegisterCustomerComponent,
      {
        centered: true,
        size: 'xl',
        backdrop: 'static',
        scrollable: true,
        container: '#check-customer',
        windowClass: 'register-customer-modal',
      }
    );
    this.registerCustomerModalRef.componentInstance.onSuccessSubmit.subscribe(
      ($event) => {
        this.selectCustomerOnRegister($event);
        this.userService.UserParentOfCheckCustomer.next($event.userId);
      }
    );
  }

  editCustomer() {
    const editComponent =
      this.customerSelected.personType == PersonType.RealPerson
        ? RealPersonalInfoComponent
        : LegalPersonalInfoComponent;

    this.registerCustomerModalRef = this.modalService.open(editComponent, {
      centered: true,
      size: 'xl',
      backdrop: 'static',
      scrollable: true,
    });
    this.registerCustomerModalRef.componentInstance.editBySeller = true;
    this.registerCustomerModalRef.componentInstance.customerSelected =
      this.customerSelected;
    this.registerCustomerModalRef.componentInstance.onSuccessSubmit.subscribe(
      ($event) => this.selectCustomerOnRegister($event)
    );
  }

  selectCustomerOnRegister(response: ICustomer) {
    this.selectCustomer(response);
  }

  submitCustomer() {
    const param: ISetCustomerInfoParams = {
      CustomerId: this.customerSelected.customerId,
      CustomerAgent: this.customerSelected.customerId,
      CustomerFirstName: this.customerSelected.firstName,
      CustomerLastName: this.customerSelected.lastName,
      CustomerNationalCode: this.customerSelected.nationalCode,
      CustomerPhone: this.customerSelected.phoneNumber,
      CustomerEmail: this.customerSelected.email,
      CustomerTitle: this.customerSelected.title,
    };
    this.cartService.setOrderCustomerInfo(param).subscribe((response) => {
      this.router.navigate(['/cart/shipping'], {
        queryParams: {
          invoiceKey: response.data.invoiceTempKey,
        },
      });
    });
  }
}
