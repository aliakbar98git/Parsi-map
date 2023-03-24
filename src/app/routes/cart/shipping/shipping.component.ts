import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { NgbModal, NgbCalendar, NgbDatepickerI18n, NgbCalendarPersian, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { faInfoCircle, faTruck, faAngleLeft, faAngleDown, faClock, faPlus, faLongArrowAltRight, faThLarge, faArchive, faCalendar, faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'jalali-moment';
import { AddressDetailComponent } from '../../profile/address-detail/address-detail.component';
import { CartService, ICartKeys, IOfferInvoiceShipping, IShippingAddress, IShippingParams, ShippingShiftType } from '../shared';
import { ToastService } from './../../../shared/toast/toast.service';
import { AddressGet, ShippingPeriod } from '../../profile/shared';
import { IInvoiceShippingItem, IShippingSellerInfo, ITimeTable } from './../shared/cart.model';
import { CheckoutSteps } from '../shared/checkout-step.enum';
import { Global, IResponse, SharedService } from '@shared/.';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { UserService, UserType } from '../../user/shared';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomDateParserFormatter, NgbDatepickerI18nPersian } from '@shared/_i18n/date-picker-persian';

@Component({
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.scss'],
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarPersian },
    { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nPersian },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class ShippingComponent implements OnInit {
  subscription: Subscription;
  isLoading: boolean;
  addressList: IShippingAddress;
  addressSelected: AddressGet = null;
  addressDetailModalRef: any;
  invoiceShippingOffers: IOfferInvoiceShipping[];
  activeOfferId: number = null;
  shippingAmountWithDiscount: number = 0;
  shippingTaxAmount: number = 0;
  shippingTotalAmount: number = 0;
  params: IShippingParams = {
    PersonAddressInfoId: null,
    Transferee: '',
    Description: '',
    ShippingMethodId: null,
    SendWithDealerOrders: false,
    TimeSpan: false,
    ShiftType: ShippingShiftType.Unspecified,
    StartDate: null,
    EndDate: null,
    DeliveryDate: null,
    ShippingPeriod: null,
    ShippingTotalCost: null,
    InvoiceShippingOrderInfoList: [],
    ExclusiveShipment: false,
    ShippingDescription: '',
    InvoiceTempKey: '',
    InStoreInventory: false
  }
  latestShippingPeriod: number = null;
  latestDeliveryDate: String = '';
  latestShippingMethodId: number = null;
  sellerExtraInfo: IShippingSellerInfo;
  global = Global;
  exclusiveForm: FormGroup;
  inStoreInventory: FormControl = new FormControl(false);
  today = moment()
  minDate: NgbDateStruct = { year: Number(this.today.format('jYYYY')), month: Number(this.today.format('jMM')), day: Number(this.today.format('jDD')) };
  userType: typeof UserType;
  shippingShiftType: typeof ShippingShiftType;
  shippingPeriod: typeof ShippingPeriod;

  faLongArrowAltRight = faLongArrowAltRight;
  faInfoCircle = faInfoCircle;
  faAngleLeft = faAngleLeft;
  faAngleDown = faAngleDown;
  faTruck = faTruck;
  faClock = faClock;
  faPlus = faPlus;
  faThLarge = faThLarge;
  faArchive = faArchive;
  faCalendar = faCalendar;
  faChevronCircleLeft = faChevronCircleLeft;

  constructor(
    private modalService: NgbModal,
    private cartService: CartService,
    private router: Router,
    private toastService: ToastService,
    private viewportScroller: ViewportScroller,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private title: Title,
    private formBuilder: FormBuilder,
    public userService: UserService
  ) {
    this.userType = UserType;
  }

  ngOnInit(): void {
    this.title.setTitle('تخصصیص اطلاعات حمل و تحویل سفارش');
    this.shippingShiftType = ShippingShiftType;
    this.shippingPeriod = ShippingPeriod;
    if (this.userService.currentUser.userType === UserType.Seller) {
      this.subscription = this.route.queryParams.subscribe(params => {
        if (typeof params.invoiceKey === "string" && params.invoiceKey != "") {
          this.params.InvoiceTempKey = params.invoiceKey
          this.getSellerExtraData()
        }
      });
      this.exclusiveForm = this.formBuilder.group({
        shippingCost: ['', Validators.required],
        shippingDate: ['', Validators.required],
        shippingDescription: ['']
      });

      this.shippingCost.valueChanges.subscribe(response => {
        this.shippingAmountWithDiscount = Number(response);
        this.shippingTaxAmount = this.addressList.calculateShippingCostTax ? Math.round(((this.sellerExtraInfo.vatRate + this.sellerExtraInfo.chargeRate) / 100) * response) : 0;
        this.shippingTotalAmount = this.shippingAmountWithDiscount + this.shippingTaxAmount;
        this.params.ShippingTotalCost = this.shippingAmountWithDiscount;
      })
    } else {
      this.getAddressList(null);
    }
  }

  ngOnDestroy() {
    if (this.userService.currentUser.userType === UserType.Seller)
      this.subscription.unsubscribe();
  }

  public get checkoutSteps(): typeof CheckoutSteps {
    return CheckoutSteps;
  }

  get shippingCost(): AbstractControl {
    return this.exclusiveForm.get("shippingCost");
  }

  get shippingDate(): AbstractControl {
    return this.exclusiveForm.get("shippingDate");
  }

  get shippingDescription(): AbstractControl {
    return this.exclusiveForm.get("shippingDescription");
  }

  getSellerExtraData() {
    this.cartService.getSellerExtraData(this.params.InvoiceTempKey).subscribe(response => {
      this.sellerExtraInfo = response.data;
      this.getAddressList(this.sellerExtraInfo.customerId);
    }, error => {
      this.router.navigate(['/cart/check-customer']);
    })
  }

  getAddressList(personId: number): void {
    this.isLoading = true;
    this.cartService.getShippingPersonAddressInfo(personId).subscribe(response => {
      this.addressList = response.data;
      const addressDefault: AddressGet[] = this.addressList.getPersonAddressInfoDtoList.filter((item: AddressGet) => { return item.isDefault == true });
      if (addressDefault.length == 1)
        this.selectAddress(addressDefault[0]);
      else
        this.isLoading = false;
    }, ({error}) => {
      if (error.data?.needToConfirm) {
        this.sharedService.resendSmsSecurityCode().subscribe();
        this.router.navigate(['user/confirm-mobile-number'], {
          queryParams: { redirectToShipping: true }
        });
      } else if (error.data?.needToAcceptPolicy) {
        this.router.navigate(['user/accept-site-policy']);
      }
    });
  }

  addNewAddress() {
    this.addressDetailModalRef = this.modalService.open(AddressDetailComponent, { centered: true, size: 'lg' });
    this.addressDetailModalRef.componentInstance.onSuccessSubmit.subscribe((response) => this.onSuccessSubmit(response));
    this.addressDetailModalRef.componentInstance.personId = this.sellerExtraInfo.customerId;
  }

  onSuccessSubmit(address: AddressGet): void {
    this.addressDetailModalRef.close();
    this.selectAddress(address);
    this.addressList.getPersonAddressInfoDtoList.push(address);
  }

  changeAddress() {
    this.selectAddress(null);
  }

  selectAddress(address: AddressGet) {
    this.addressSelected = address;
    this.invoiceShippingOffers = undefined;
    this.params.PersonAddressInfoId = address == null ? null : address.personAddressInfoId;
    this.params.InvoiceShippingOrderInfoList = [];
    this.resetParams();

    if (address != null)
      this.getInvoiceShippingOffers();
  }

  changeExclusiveShipment(value: boolean) {
    this.exclusiveForm.reset();
    this.resetParams();
    this.params.ExclusiveShipment = value;
    this.params.ShippingDescription = '';
    this.invoiceShippingOffers = undefined;

    if (value) {
      this.cartService.getCart().subscribe(response => {
        const responseData = response.data;
        const orderInfoList = responseData.orderItems.map(item => {
          return {
            marketingProductId: item.marketingProductId,
            marketingProductModel: item.marketingProductModel,
            marketingProductName: item.marketingProductName,
            productDocumentInfoId: item.productDocumentInfoId,
            productPrice: item.unitPrice,
            quantity: item.quantity,
            imageType: item.imageType
          }
        });
        this.invoiceShippingOffers = [{
          invoiceShippingItems: null,
          orderInfoList: orderInfoList,
          amount: responseData.totalAmount,
          taxAmount: responseData.taxAmount,
          totalAmount: responseData.paymentAmount
        }];
        this.activeOfferId = 0;
      })
    } else if (this.addressSelected != undefined && this.selectAddress) {
      this.getInvoiceShippingOffers();
    }
  }

  getInvoiceShippingOffers() {
    this.isLoading = true;
    this.cartService.getOfferInvoiceShipping(this.addressSelected.personAddressInfoId).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe((response: IResponse<IOfferInvoiceShipping[]>) => {
      this.invoiceShippingOffers = response.data;
      if (response.data.length == 1) this.activeOfferId = 0;
    });
  }

  toggleOfferPack(index: number) {
    if (this.activeOfferId == index) return;
    this.activeOfferId = index;
    this.resetParams();
    this.viewportScroller.scrollToAnchor(`checkout-pack-${index}`);
  }

  setShippingTransferee(transferee: string) {
    this.params.Transferee = transferee;
  }

  setShippingDescription(description: string) {
    this.params.Description = description;
  }

  private resetParams() {
    this.params.ShippingMethodId = 0;
    this.params.SendWithDealerOrders = false;
    this.params.TimeSpan = false;
    this.params.ShippingTotalCost = null;
    this.shippingAmountWithDiscount = 0;
    this.shippingTaxAmount = 0;
    this.shippingTotalAmount = 0;
    this.params.StartDate = null;
    this.params.EndDate = null;
    this.params.ShiftType = ShippingShiftType.Unspecified;
    this.params.DeliveryDate = null;
    this.params.ShippingPeriod = ShippingPeriod.Unspecified;
    if (this.userService.currentUser.userType === UserType.Seller) this.shippingCost.setValue(null);
  }

  private setMethod(shipping: IInvoiceShippingItem) {
    this.resetParams();
    this.params.ShippingMethodId = shipping.shippingMethodId;
    this.params.SendWithDealerOrders = shipping.sendWithDealerOrders;
    this.params.TimeSpan = shipping.timeSpan;
    this.params.ShippingTotalCost = shipping.shippingTotalAmount;
    this.shippingAmountWithDiscount = shipping.shippingAmountWithDiscount;
    this.shippingTaxAmount = shipping.shippingTaxAmount;
    this.shippingTotalAmount = shipping.shippingTotalAmount;
  }

  setTimeSpan(shipping: IInvoiceShippingItem) {
    this.setMethod(shipping);
    this.params.StartDate = shipping.timeSpanPlaning.startDate;
    this.params.EndDate = shipping.timeSpanPlaning.endDate;
  }

  setSiftType(shipping: IInvoiceShippingItem, data: ITimeTable) {
    this.setMethod(shipping);
    this.params.ShiftType = shipping.shiftTypePlaning[0].shiftType;
    this.params.DeliveryDate = data.deliveryDate;
    this.params.ShippingPeriod = data.shippingPeriod;
  }

  submitShippingPack(offer: IOfferInvoiceShipping) {
    this.params.InvoiceShippingOrderInfoList = offer.orderInfoList;
    this.params.InStoreInventory = this.inStoreInventory.value;
    let messages = [];
    if (this.params.Transferee == '') messages.push('لطفا نام تحویل گیرنده را وارد نمایید.');
    if (this.params.PersonAddressInfoId == null) messages.push('لطفا آدرس تحویل را انتخاب نمایید.');
    if (!this.params.ExclusiveShipment && 
        ((this.params.TimeSpan && (this.params.StartDate == '' || this.params.EndDate == '')) ||
        (!this.params.TimeSpan && (this.params.ShiftType == 0 || this.params.DeliveryDate == '' || this.params.ShippingPeriod == 0)))
        ) messages.push('لطفا زمان ارسال را تعیین کنید.');
    if (messages.length != 0) {
      messages.forEach(msg => { this.toastService.showWarning(msg) });
      return;
    }
    if (this.params.ExclusiveShipment) {
      this.exclusiveForm.markAllAsTouched();
      if (this.exclusiveForm.invalid) return;
      this.params.DeliveryDate = moment.from(`${this.shippingDate.value.year}/${this.shippingDate.value.month}/${this.shippingDate.value.day}`, 'fa', 'YYYY/MM/D').format()
      this.params.ShippingDescription = this.shippingDescription.value;
    }
    this.cartService.submitShipping(this.params).subscribe((response: IResponse<ICartKeys>) => {
      this.router.navigate(['/cart/payment'], {
        queryParams: {
          shippingKey: response.data.invoiceShippingTempKey,
          invoiceKey: response.data.invoiceTempKey
        }
      });
    });
  }
}
