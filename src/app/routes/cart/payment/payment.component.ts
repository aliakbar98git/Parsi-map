import { ViewportScroller } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import {
  faAngleDown,
  faAngleLeft,
  faArrowLeft,
  faCalendar,
  faCreditCard,
  faDatabase,
  faDownload,
  faFileInvoice,
  faHandPaper,
  faLongArrowAltLeft,
  faLongArrowAltRight,
  faMoneyBillWaveAlt,
  faMoneyCheck,
  faPlus,
  faQrcode,
  faReceipt,
  faSpinner,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  NgbCalendar,
  NgbCalendarPersian,
  NgbDateParserFormatter,
  NgbDatepickerI18n,
  NgbDateStruct,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Global, IResponse, PaymentStatus, TranslateService } from '@shared/.';
import { ToastService } from '@shared/toast/toast.service';
import { DocumentType } from '@shared/_enums/documentType.enum';
import { PaymentMethod } from '@shared/_enums/payment-method.enum';
import {
  CustomDateParserFormatter,
  NgbDatepickerI18nPersian,
} from '@shared/_i18n/date-picker-persian';
import * as moment from 'jalali-moment';
import { interval, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { identityMatchingPrecentValidator } from 'src/app/helpers';
import {
  Bank,
  InvoicePayment,
  InvoiceStatus,
  PayMehrBankCreditPayment,
  PaymentBankAccount,
  ShippingPeriod,
} from '../../profile/shared';
import { UserService, UserType } from '../../user/shared';
import { BetaReceiptComponent } from '../beta-receipt/beta-receipt.component';
import { MehrIpgConfirmationComponent } from '../mehr-ipg-confirmation/mehr-ipg-confirmation.component';
import { PostBankConfirmationComponent } from '../post-bank-confirmation/post-bank-confirmation.component';
import { QRCodeComponent } from '../qr-code/qr-code.component';
import {
  CartService,
  IPaymentInfo,
  IPaymentInfoParams,
  IPayParams,
} from '../shared';
import { CheckoutSteps } from '../shared/checkout-step.enum';
import { CreditPaymentMethod } from '../shared/credit-payment-method';
import { PaymentGateway } from '../shared/paymentGateway.enum';
import { environment } from './../../../../environments/environment';
import { OrderService } from './../../product/shared/order.service';
import {
  IDiscountCheckParams,
  IDiscountResult,
  IPayInvoiceResult,
  validateTopContractCodeRequest,
  validateTopContractCodeResponse,
} from './../shared/cart.model';

@Component({
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarPersian },
    { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nPersian },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class PaymentComponent implements OnInit, OnDestroy {
  isSeller: boolean;
  qrCodeModal: any;
  betaReceiptModal: any;

  subscription: Subscription = new Subscription();
  paymentStatusSubscription: Subscription;
  paymentStatusInterval: number = 10 * 1000;
  paymentStatusTimerSubscription: Subscription;
  paymentStatusTimer: number = 0;
  updatePaymentHistoryBtn: boolean = false;
  paymentStatusLoading: boolean = false;
  paymentInfoParams: IPaymentInfoParams;
  invalidInput: boolean = true;
  message: string =
    'مقادیر ورودی معتبر نیستند. لطفا مجدد و با لینک درست تلاش نمایید.';
  paymentInfo: IPaymentInfo;
  collapsePayInfo: boolean = false;
  collapseDiscountPanel: boolean = false;
  enableSubmitPayment: boolean = false;
  global = Global;
  payInfo: IPayParams = {
    PaymentAmount: 0,
    PaymentMethod: null,
    PanoContactNumber: '',
  };
  discountParams: IDiscountCheckParams = {
    DiscountCode: {
      DiscountCode: '',
      ConfirmationCode: '',
      VerifyConfirmationCode: false,
    },
    SpecialDiscount: null,
  };
  discountResult: IDiscountResult;
  sellerDiscountResult: IDiscountResult;
  sellerSpecialDiscountResult: IDiscountResult;
  checkoutSteps: typeof CheckoutSteps;
  paymentGateway: typeof PaymentGateway;
  paymentMethod: typeof PaymentMethod;
  creditPaymentMethod: typeof CreditPaymentMethod;
  creditPaymentMethodItems: {
    label: string;
    value: number;
    disabled: boolean;
  }[] = [];
  userType: typeof UserType;
  documentType: typeof DocumentType;
  moment = moment().locale('fa');
  todayDate = moment().format('YYYY/MM/DD');
  bankItems: Bank[];
  bankItemsLoading: boolean;
  bankAccountsItems: PaymentBankAccount[];
  bankAccountItemsLoading: boolean;
  defaultBankAccount: PaymentBankAccount;
  continuePaymentBtn;
  today = moment();
  maxDate: NgbDateStruct = {
    year: Number(this.today.format('jYYYY')),
    month: Number(this.today.format('jMM')),
    day: Number(this.today.format('jDD')),
  };
  isSubmitting: boolean = false;
  discountForm: FormGroup;
  specialDiscountForm: FormGroup;
  onlinePosForm: FormGroup;
  manualPosForm: FormGroup;
  betaPaymentForm: FormGroup;
  depositSlipForm: FormGroup;
  chequeForm: FormGroup;
  settlementForm: FormGroup;
  neshanPardakhtForm: FormGroup;
  panoForm: FormGroup;
  creditPaymentForm: FormGroup;
  shippingPeriod: typeof ShippingPeriod;
  creditSalesContracLink: string;
  faAngleLeft = faAngleLeft;
  faAngleDown = faAngleDown;
  faArrowLeft = faArrowLeft;
  faTrashAlt = faTrashAlt;
  faCreditCard = faCreditCard;
  faMoneyCheck = faMoneyCheck;
  faHandPaper = faHandPaper;
  faQrcode = faQrcode;
  faReceipt = faReceipt;
  faFileInvoice = faFileInvoice;
  faLongArrowAltRight = faLongArrowAltRight;
  faLongArrowAltLeft = faLongArrowAltLeft;
  faCalendar = faCalendar;
  faDownload = faDownload;
  faSpinner = faSpinner;
  faDatabase = faDatabase;
  faPlus = faPlus;
  faPaypal = faPaypal;
  faMoneyBillWaveAlt = faMoneyBillWaveAlt;
  betaPaymentDate = [];
  betaInstallments = [];
  prepayment;
  payInvoiceData: any;
  qrCodeValue: string;
  successPayment = false;
  @ViewChild('discountCode') discountCodeInput: ElementRef;
  @ViewChild('confirmationCode') confirmationCodeInput: ElementRef;
  betaPaymentAmount;
  betaPayInvioce: {
    firstLoanRefundDate: string
    totalWageAmount: number
    maximumLoanAmount: number
    gracePeriodCount: number
    numberOfInstallments: number
  };
  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private toastService: ToastService,
    private title: Title,
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private viewportScroller: ViewportScroller,
    public userService: UserService,
    private orderService: OrderService,
    private translateService: TranslateService,
    private modalService: NgbModal
  ) {
    this.checkoutSteps = CheckoutSteps;
    this.paymentGateway = PaymentGateway;
    this.paymentMethod = PaymentMethod;
    this.creditPaymentMethod = CreditPaymentMethod;
    this.userType = UserType;
    this.documentType = DocumentType;
    this.bankItemsLoading = true;
    this.bankAccountItemsLoading = true;
  }

  ngOnInit() {
    this.title.setTitle('پرداخت صورت حساب');
    this.isSeller =
      this.userService.currentUser.userType === UserType.Seller ? true : false;
    this.shippingPeriod = ShippingPeriod;

    this.subscription.add(
      this.route.queryParams.subscribe((params) => {
        if (typeof params.invoiceId != 'undefined') {
          this.paymentInfoParams = {
            InvoiceId: params.invoiceId,
            InvoiceTempKey: params.invoiceKey,
          };
          if (
            typeof this.paymentInfoParams.InvoiceId === 'string' &&
            this.paymentInfoParams.InvoiceId != ''
          ) {
            this.invalidInput = false;
            this.payInfo.InvoiceId = this.paymentInfoParams.InvoiceId;
            this.discountParams.InvoiceId = this.paymentInfoParams.InvoiceId;
            this.getPaymentInfo();
          }
          return;
        }
        this.paymentInfoParams = {
          InvoiceShippingTempKey: params.shippingKey,
          InvoiceTempKey: params.invoiceKey,
        };
        if (
          typeof this.paymentInfoParams.InvoiceShippingTempKey === 'string' &&
          this.paymentInfoParams.InvoiceShippingTempKey != '' &&
          typeof this.paymentInfoParams.InvoiceTempKey === 'string' &&
          this.paymentInfoParams.InvoiceTempKey != ''
        ) {
          this.invalidInput = false;
          this.payInfo.InvoiceShippingTempKey =
            this.paymentInfoParams.InvoiceShippingTempKey;
          this.payInfo.InvoiceTempKey = this.paymentInfoParams.InvoiceTempKey;
          this.discountParams.InvoiceShippingTempKey =
            this.paymentInfoParams.InvoiceShippingTempKey;
          this.getPaymentInfo();
        }
      })
    );
    if (this.isSeller) {
      this.getBankList();
      this.getBankAccounts();

      this.discountForm = this.formBuilder.group({
        discountCode: [
          { value: '', disabled: this.payInfo.InvoiceId != undefined },
          [Validators.required],
        ],
      });
      this.specialDiscountForm = this.formBuilder.group(
        {
          specialDiscountPercent: [
            { value: '', disabled: this.payInfo.InvoiceId != undefined },
            [Validators.required, Validators.min(0), Validators.max(100)],
          ],
          specialDiscountDescription: [
            { value: '', disabled: this.payInfo.InvoiceId != undefined },
            [Validators.required],
          ],
          specialDiscountDetails: this.formBuilder.array([
            this.newSpecialDiscountDetail(),
          ]),
        },
        { validators: identityMatchingPrecentValidator }
      );
      this.onlinePosForm = this.formBuilder.group({
        posIpAddressId: ['', [Validators.required]],
        paymentAmount: ['', [Validators.required]],
      });
      this.manualPosForm = this.formBuilder.group({
        referenceNumber: ['', [Validators.required]],
        trackingNumber: ['', [Validators.required]],
        paymentDate: ['', [Validators.required]],
        paymentAmount: ['', [Validators.required]],
        documentInfoId: [''],
        posIpAddressId: ['', [Validators.required]],
      });
      this.depositSlipForm = this.formBuilder.group({
        bankAccountsId: ['', [Validators.required]],
        trackingNumber: ['', [Validators.required]],
        transactionDate: ['', [Validators.required]],
        documentInfoId: ['', [Validators.required]],
        paymentAmount: ['', [Validators.required]],
      });
      this.chequeForm = this.formBuilder.group({
        bankId: ['', [Validators.required]],
        accountNumber: ['', [Validators.required]],
        chequeNumber: ['', [Validators.required]],
        chequeDate: ['', [Validators.required]],
        documentInfoId: ['', [Validators.required]],
        paymentAmount: ['', [Validators.required]],
      });
      this.settlementForm = this.formBuilder.group(
        {
          orderBy: ['', [Validators.required]],
          invoiceNumber: ['', []],
          referenceNumber: ['', []],
          description: ['', []],
          documentInfoId: ['', [Validators.required]],
          paymentAmount: ['', [Validators.required]],
        },
        {
          validators: (control: FormGroup): ValidationErrors | null => {
            const invoice = control.get('invoiceNumber').value;
            const reference = control.get('referenceNumber').value;
            if (
              (invoice == null && reference == null) ||
              (invoice == '' && reference == '')
            )
              return null;
            else if (
              invoice != null &&
              invoice.length > 0 &&
              reference != null &&
              reference.length > 0
            )
              return null;
            else if (
              (invoice == null && reference == '') ||
              (invoice == '' && reference == null)
            )
              return null;
            else return { invoiceOrReference: true };
          },
        }
      );
      this.neshanPardakhtForm = this.formBuilder.group({
        paymentDate: ['', [Validators.required]],
        referenceNumber: ['', [Validators.required]],
        documentInfoId: ['', []],
        paymentAmount: ['', [Validators.required]],
      });
      this.panoForm = this.formBuilder.group({
        paymentAmount: ['', [Validators.required]],
        panoContactNumber: ['', [Validators.required]],
      });
    }
    this.creditPaymentForm = this.formBuilder.group({
      creditSalesContractId: [null, [Validators.required]],
      creditPaymentMethod: [null, [Validators.required]],
      topContractCodeInput: [null],
      topContractCode: [null],
      documentInfoId: [null],
      paymentAmount: ['', [Validators.required]],
    });
    this.betaPaymentForm = this.formBuilder.group({
      CreditSalesContractId: ['', [Validators.required]],
      paymentDate: ['', [Validators.required]],
      NumberOfInstallments: ['', [Validators.required]],
      MaximumLoanAmount: ['', [Validators.required]],
      InvoicePayValue: [''],
    });

    this.subscription.add(
      this.creditPaymentForm
        .get('creditPaymentMethod')
        .valueChanges.subscribe((paymentMethod) => {
          if (paymentMethod === CreditPaymentMethod.Vamine) {
            this.creditPaymentControls('topContractCode').addValidators(
              Validators.required
            );
            this.creditPaymentControls('topContractCodeInput').addValidators(
              Validators.required
            );
          } else if (paymentMethod === CreditPaymentMethod.BetaCreditPayment) {
            this.getBetaLoanInfo();
          } else {
            this.betaPaymentControls('paymentDate').setValue('');
            this.betaPaymentControls('NumberOfInstallments').setValue('');
            this.betaPaymentControls('MaximumLoanAmount').setValue('');
            this.betaPaymentControls('CreditSalesContractId').setValue('');
            this.betaPaymentControls('InvoicePayValue').setValue('');

            this.creditPaymentControls('topContractCode').removeValidators(
              Validators.required
            );
            this.creditPaymentControls('topContractCodeInput').removeValidators(
              Validators.required
            );
            this.creditPaymentControls('topContractCode').setValue(null);
            this.creditPaymentControls('topContractCodeInput').setValue(null);
          }
          this.creditPaymentControls(
            'topContractCode'
          ).updateValueAndValidity();
          this.creditPaymentControls(
            'topContractCodeInput'
          ).updateValueAndValidity();
          this.setPaymentAmountValue(paymentMethod);
          if (
            paymentMethod === CreditPaymentMethod.Azkivam ||
            paymentMethod === CreditPaymentMethod.Vamine
          ) {
            this.creditPaymentControls('paymentAmount').disable();
          } else {
            if (this.creditPaymentControls('paymentAmount').disabled)
              this.creditPaymentControls('paymentAmount').enable();
          }
        })
    );
  }

  getBetaLoanInfo(): void {
    this.http
      .get<IResponse>(
        `${environment.apiUrl}/CreditSalesContract/GetBetaRefundLoanDates`
      )
      .subscribe((response) => {
        this.betaPaymentDate = response.data;
      });
    let httpParams = new HttpParams().set(
      'CreditSalesContractId',
      this.creditPaymentControls('creditSalesContractId').value
    );
    this.http
      .get<IResponse>(
        `${environment.apiUrl}/CreditSalesContractInstallmentsTerms/GetCreditSalesContractNumberOfInstallments`,
        { params: httpParams }
      )
      .subscribe((response) => {
        this.betaInstallments = response.data;
      });
    this.betaPaymentControls('CreditSalesContractId').setValue(
      this.creditPaymentControls('creditSalesContractId').value
    );
  }

  checkBetaInvoice(): void {
    this.betaPaymentControls('InvoicePayValue').setValue(this.creditPaymentControls('paymentAmount').value);
    const date = this.betaPaymentDate.find((item) => item.refundDate == this.betaPaymentControls('paymentDate').value);
    let httpParams = new HttpParams()
      .set('CreditSalesContractId', this.betaPaymentControls('CreditSalesContractId').value)
      .set('paymentDate', this.betaPaymentControls('paymentDate').value)
      .set('NumberOfInstallments', this.betaPaymentControls('NumberOfInstallments').value)
      .set('MaximumLoanAmount', this.betaPaymentControls('MaximumLoanAmount').value)
      .set('InvoicePayValue', this.betaPaymentControls('InvoicePayValue').value)
      .set('GracePeriodCount', date.gracePeriodCount);
    this.http.get<IResponse>(`${environment.apiUrl}/CreditSalesContract/CalculateBetaCreditPayment`, { params: httpParams })
      .subscribe((response) => {
        this.betaPayInvioce = {
          firstLoanRefundDate: this.betaPaymentControls('paymentDate').value,
          gracePeriodCount: date.gracePeriodCount,
          maximumLoanAmount: this.betaPaymentControls('MaximumLoanAmount').value,
          numberOfInstallments: this.betaPaymentControls('NumberOfInstallments').value,
          totalWageAmount: response.data.totalWageAmount
        };
        this.betaReceiptModal = this.modalService.open(BetaReceiptComponent, { centered: true });
        const resultDate = date.refundPersianDate;
        this.betaReceiptModal.componentInstance.data = { ...response.data, resultDate };
        this.betaReceiptModal.componentInstance.onSuccessSubmit.subscribe(
          (response) => {
            if (response.payAmount) {
              this.betaPaymentAmount = response.payAmount;
              this.payInvoice();
            }
          }
        );
      });
  }

  setPaymentAmountValue(paymentMethod) {
    if (paymentMethod === CreditPaymentMethod.Vamine && !this.prepayment) {
      this.creditPaymentControls('paymentAmount').setValue('');
    } else if (this.prepayment) {
      this.creditPaymentControls('paymentAmount').setValue(
        this.prepaymentPrice(this.paymentInfo.billSummary.payValue)
      );
    } else {
      this.creditPaymentControls('paymentAmount').setValue(
        this.paymentInfo.billSummary.remainValue
      );
    }
  }

  prepaymentPrice(data: any) {
    const maxPrePrice = Math.round(data - data * (this.prepayment / 100));
    let price = maxPrePrice;
    if (this.paymentInfo.billSummary.remainValue > maxPrePrice) {
      price = maxPrePrice;
    } else {
      price = this.paymentInfo.billSummary.remainValue;
    }
    return price;
  }

  setCreditPaymentMethod(contract) {
    if (!contract) {
      this.creditPaymentControls('creditPaymentMethod').setValue(null);
      this.creditPaymentControls('paymentAmount').setValue('');
      if (this.creditPaymentControls('paymentAmount').disabled)
        this.creditPaymentControls('paymentAmount').enable();
      this.creditPaymentMethodItems = [];
      this.creditSalesContracLink = '';
      return;
    }

    this.creditSalesContracLink = contract.name;
    this.creditPaymentMethodItems = contract.creditPaymentMethods.map(
      (item) => {
        return {
          label: this.translateService.translateEnum(
            this.creditPaymentMethod[item]
          ),
          value: item,
          disabled:
            item == CreditPaymentMethod.Azkivam &&
            this.paymentInfo.billSummary.remainValue !==
            this.paymentInfo.billSummary.payValue,
        };
      }
    );

    if (contract.mandatoryPrepaymentPercentage) {
      this.prepayment = contract.mandatoryPrepaymentPercentage;
    } else {
      this.prepayment = null;
    }

    if (
      this.creditPaymentMethodItems.length === 1 &&
      !(
        this.creditPaymentMethodItems[0].value ===
        CreditPaymentMethod.Azkivam &&
        this.paymentInfo.billSummary.remainValue <
        this.paymentInfo.billSummary.payValue
      )
    )
      this.creditPaymentControls('creditPaymentMethod').setValue(
        this.creditPaymentMethodItems[0].value
      );
    else this.creditPaymentControls('creditPaymentMethod').setValue(null);
  }

  validateTopContractCode(creditSalesContract: NgSelectComponent) {
    this.creditPaymentControls('topContractCode').setValue(null);
    this.creditPaymentControls('paymentAmount').setValue('');
    const params: validateTopContractCodeRequest = {
      invoiceTempKey: this.payInfo.InvoiceTempKey,
      invoiceId: this.payInfo.InvoiceId,
      code: this.creditPaymentControls('topContractCodeInput').value,
    };
    this.http
      .post<IResponse<validateTopContractCodeResponse>>(
        `${environment.apiUrl}/TopContractCode/ValidateTopContractCode`,
        params
      )
      .subscribe((response) => {
        this.creditPaymentControls('topContractCode').setValue(
          this.creditPaymentControls('topContractCodeInput').value
        );
        let availableAmount = this.paymentInfo.billSummary.remainValue;
        if (
          creditSalesContract.selectedValues[0].mandatoryPrepaymentPercentage
        ) {
          availableAmount =
            this.paymentInfo.billSummary.remainValue -
            this.paymentInfo.billSummary.remainValue *
            (creditSalesContract.selectedValues[0]
              .mandatoryPrepaymentPercentage /
              100);
          availableAmount = Math.round(availableAmount);
        }
        if (availableAmount > response.data.amount) {
          const fraction = availableAmount - response.data.amount;
          if (fraction >= 10001 || fraction <= 1000) {
            this.creditPaymentControls('paymentAmount').setValue(
              response.data.amount
            );
          } else {
            this.creditPaymentControls('paymentAmount').setValue(
              response.data.amount - 10001
            );
          }
        } else {
          this.creditPaymentControls('paymentAmount').setValue(availableAmount);
        }
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.paymentStatusSubscription &&
      this.paymentStatusSubscription.unsubscribe();
    this.paymentStatusTimerSubscription &&
      this.paymentStatusTimerSubscription.unsubscribe();
  }

  getBankList(): void {
    this.http
      .get<IResponse<Bank[]>>(`${environment.apiUrl}/bank/getBanks`)
      .pipe(finalize(() => (this.bankItemsLoading = false)))
      .subscribe((response) => (this.bankItems = response.data));
  }

  getBankAccounts(): void {
    this.http
      .get<IResponse<PaymentBankAccount[]>>(
        `${environment.apiUrl}/BankAccounts/GetBankAccounts`
      )
      .pipe(finalize(() => (this.bankAccountItemsLoading = false)))
      .subscribe((response) => {
        this.bankAccountsItems = response.data;
        const defaultAccount = this.bankAccountsItems.filter((item) => {
          return item.isDefault;
        });
        if (defaultAccount.length == 1)
          setTimeout(() => {
            this.defaultBankAccount = defaultAccount[0];
            this.depositControls('bankAccountsId').setValue(
              defaultAccount[0].bankAccountsId
            );
          }, 100);
      });
  }

  getPaymentInfo() {
    this.cartService.getPaymentInfo(this.paymentInfoParams).subscribe(
      (response) => {
        this.paymentInfo = response.data;
        if (
          this.paymentInfo.paymentMethods.some(
            (item) => item === PaymentMethod.CreditPayment
          )
        ) {
          const creditPayments = this.paymentInfo.invoicePayments.filter(
            (item) => item.paymentMethod === PaymentMethod.CreditPayment
          );
          if (
            creditPayments.some(
              (item) =>
                item.status !== PaymentStatus.Unverified &&
                item.status !== PaymentStatus.Failed &&
                item.status !== PaymentStatus.Canceled
            )
          ) {
            this.creditPaymentForm.disable({ emitEvent: false });
          }

          this.findContinueBtn(creditPayments);
        }
        this.updatePayInfo();
        this.checkPaymentStatusIntervalState();
        if (this.isSeller) this.resetForms();
      },
      () => {
        if (this.isSeller) {
          this.router.navigate(['/cart/check-customer']);
        } else {
          this.router.navigate(['/cart/shipping']);
        }
      }
    );
  }

  findContinueBtn(creditPayments: any): void {
    if (
      this.paymentInfo.invoiceDataDto.invoiceStatus ===
      InvoiceStatus.PendingVerification ||
      this.paymentInfo.invoiceDataDto.invoiceStatus ===
      InvoiceStatus.PartialPayment
    ) {
      creditPayments.some((item) => {
        if (
          item.status === PaymentStatus.PendingVerification &&
          (item.creditPaymentMethod ===
            CreditPaymentMethod.MehrBankCreditPaymentWithoutCard ||
            item.creditPaymentMethod ===
            CreditPaymentMethod.PostBankCreditPaymentWithoutCredit)
        ) {
          this.continuePaymentBtn = item;
        }
      });
    }
  }

  specialDiscountDetails(): FormArray {
    return this.specialDiscountForm.get('specialDiscountDetails') as FormArray;
  }

  private newSpecialDiscountDetail(): FormGroup {
    return this.formBuilder.group({
      managementDiscountTypeId: [null, Validators.required],
      managementDiscountCommandIssuerId: [null, Validators.required],
      discountPercent: [
        '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });
  }

  addSpecialDiscountDetails() {
    this.specialDiscountDetails().push(this.newSpecialDiscountDetail());
  }

  removeSpecialDiscountDetails(i: number) {
    this.specialDiscountDetails().removeAt(i);
  }

  discountControls(controlName: string): AbstractControl {
    return this.discountForm.get(controlName);
  }

  specialDiscountControls(controlName: string): AbstractControl {
    return this.specialDiscountForm.get(controlName);
  }

  onlineControls(controlName: string): AbstractControl {
    return this.onlinePosForm.get(controlName);
  }

  manualControls(controlName: string): AbstractControl {
    return this.manualPosForm.get(controlName);
  }

  depositControls(controlName: string): AbstractControl {
    return this.depositSlipForm.get(controlName);
  }

  chequeControls(controlName: string): AbstractControl {
    return this.chequeForm.get(controlName);
  }

  settlementControls(controlName: string): AbstractControl {
    return this.settlementForm.get(controlName);
  }

  neshanControls(controlName: string): AbstractControl {
    return this.neshanPardakhtForm.get(controlName);
  }

  panoControls(controlName: string): AbstractControl {
    return this.panoForm.get(controlName);
  }

  creditPaymentControls(controlName: string): AbstractControl {
    return this.creditPaymentForm.get(controlName);
  }
  betaPaymentControls(controlName: string): AbstractControl {
    return this.betaPaymentForm.get(controlName);
  }

  updateIpgPaymentInfo(gateway: PaymentGateway) {
    this.payInfo.PaymentMethod = this.paymentMethod.Ipg;
    this.payInfo.IpgPayment = {
      PaymentGateway: gateway,
    };
  }

  getPaymentAmount(amount: string): number {
    return Number(amount.toString().replace(/,/g, ''));
  }

  payInvoice() {
    let referenceNumber: string = '';
    let trackingNumber: string = '';
    let transactionDate: string = '';
    if (this.payInfo.DocumentInfoId) delete this.payInfo.DocumentInfoId;
    switch (this.payInfo.PaymentMethod) {
      case null:
        this.router.navigate(
          ['/cart/payment-receipt', this.payInfo.InvoiceId],
          {
            queryParams: { invoiceKey: this.paymentInfoParams.InvoiceTempKey },
          }
        );
        return;
      case this.paymentMethod.Ipg:
        this.payInfo.PaymentAmount = this.paymentInfo.billSummary.payValue;
        break;
      case this.paymentMethod.OnlinePos:
        this.payInfo.PaymentAmount = this.getPaymentAmount(
          this.onlineControls('paymentAmount').value
        );
        this.payInfo.OnlinePosPayment = {
          PosIpAddressId: Number(this.onlineControls('posIpAddressId').value),
        };
        break;
      case this.paymentMethod.ManualPos:
        this.payInfo.PaymentAmount = this.getPaymentAmount(
          this.manualControls('paymentAmount').value
        );
        this.payInfo.DocumentInfoId =
          this.manualControls('documentInfoId').value;
        this.payInfo.ManualPosPayment = {
          ReferenceNumber: this.manualControls('referenceNumber').value,
          TrackingNumber: this.manualControls('trackingNumber').value,
          PaymentDate: moment
            .from(
              `${this.manualControls('paymentDate').value.year}/${this.manualControls('paymentDate').value.month
              }/${this.manualControls('paymentDate').value.day}`,
              'fa',
              'YYYY/MM/D'
            )
            .format('YYYY-MM-DD'),
          PosIpAddressId: Number(this.manualControls('posIpAddressId').value),
        };
        referenceNumber = this.payInfo.ManualPosPayment.ReferenceNumber;
        trackingNumber = this.payInfo.ManualPosPayment.TrackingNumber;
        transactionDate = this.payInfo.ManualPosPayment.PaymentDate;
        break;
      case this.paymentMethod.DepositSlip:
        this.payInfo.PaymentAmount = this.getPaymentAmount(
          this.depositControls('paymentAmount').value
        );
        this.payInfo.DocumentInfoId =
          this.depositControls('documentInfoId').value;
        const selectedAccount = this.bankAccountsItems.filter((item) => {
          return (
            item.bankAccountsId ==
            Number(this.depositControls('bankAccountsId').value)
          );
        })[0];
        this.payInfo.DepositSlipPayment = {
          BankId: selectedAccount.banksId,
          AccountNumber: selectedAccount.accountNumber,
          TrackingNumber: this.depositControls('trackingNumber').value,
          TransactionDate: moment
            .from(
              `${this.depositControls('transactionDate').value.year}/${this.depositControls('transactionDate').value.month
              }/${this.depositControls('transactionDate').value.day}`,
              'fa',
              'YYYY/MM/D'
            )
            .format('YYYY-MM-DD'),
        };
        referenceNumber = this.payInfo.DepositSlipPayment.TrackingNumber;
        trackingNumber = this.payInfo.DepositSlipPayment.TrackingNumber;
        transactionDate = this.payInfo.DepositSlipPayment.TransactionDate;
        break;
      case this.paymentMethod.Cheque:
        this.payInfo.PaymentAmount = this.getPaymentAmount(
          this.chequeControls('paymentAmount').value
        );
        this.payInfo.DocumentInfoId =
          this.chequeControls('documentInfoId').value;
        this.payInfo.ChequePayment = {
          BankId: this.chequeControls('bankId').value,
          AccountNumber: this.chequeControls('accountNumber').value,
          ChequeNumber: this.chequeControls('chequeNumber').value,
          ChequeDate: moment
            .from(
              `${this.chequeControls('chequeDate').value.year}/${this.chequeControls('chequeDate').value.month
              }/${this.chequeControls('chequeDate').value.day}`,
              'fa',
              'YYYY/MM/D'
            )
            .format('YYYY-MM-DD'),
        };
        referenceNumber = this.payInfo.ChequePayment.ChequeNumber;
        break;
      case this.paymentMethod.SettlementCommand:
        this.payInfo.PaymentAmount = this.getPaymentAmount(
          this.settlementControls('paymentAmount').value
        );
        this.payInfo.Description = this.settlementControls('description').value;
        this.payInfo.DocumentInfoId =
          this.settlementControls('documentInfoId').value;
        this.payInfo.SettlementCommandPayment = {
          OrderBy: this.settlementControls('orderBy').value,
          InvoiceNumber: this.settlementControls('invoiceNumber').value,
          ReferenceNumber: this.settlementControls('referenceNumber').value,
        };
        referenceNumber = this.payInfo.SettlementCommandPayment.ReferenceNumber;
        break;
      case this.paymentMethod.NeshanPardakht:
        this.payInfo.PaymentAmount = this.getPaymentAmount(
          this.neshanControls('paymentAmount').value
        );
        this.payInfo.DocumentInfoId =
          this.neshanControls('documentInfoId').value;
        this.payInfo.NeshanPardakhtPayment = {
          ReferenceNumber: this.neshanControls('referenceNumber').value,
          PaymentDate: moment
            .from(
              `${this.neshanControls('paymentDate').value.year}/${this.neshanControls('paymentDate').value.month
              }/${this.neshanControls('paymentDate').value.day}`,
              'fa',
              'YYYY/MM/D'
            )
            .format('YYYY-MM-DD'),
        };
        referenceNumber = this.payInfo.NeshanPardakhtPayment.ReferenceNumber;
        transactionDate = this.payInfo.NeshanPardakhtPayment.PaymentDate;
        break;
      case this.paymentMethod.CredentialPayment:
        this.payInfo.PaymentAmount =
          this.paymentInfo.billSummary.remainValue <=
            this.paymentInfo.billSummary.creditValue
            ? this.paymentInfo.billSummary.remainValue
            : this.paymentInfo.billSummary.creditValue;
        break;
      case this.paymentMethod.Pano:
        this.payInfo.PaymentAmount = this.getPaymentAmount(
          this.panoControls('paymentAmount').value
        );
        this.payInfo.PanoContactNumber =
          this.panoControls('panoContactNumber').value;
        break;
      case this.paymentMethod.CreditPayment:
        this.payInfo.PaymentAmount = this.getPaymentAmount(
          this.creditPaymentControls('paymentAmount').value
        );
        this.payInfo.CreditPayment = {
          CreditSalesContractId: this.creditPaymentControls('creditSalesContractId').value,
          CreditPaymentMethod: this.creditPaymentControls('creditPaymentMethod').value,
          TopContractCode: this.creditPaymentControls('topContractCode').value,
        };
        if (this.creditPaymentControls('creditPaymentMethod').value === this.creditPaymentMethod.BetaCreditPayment) {
          this.payInfo.CreditPayment = { ...this.payInfo.CreditPayment, ...this.betaPayInvioce };
          this.payInfo.PaymentAmount = this.betaPaymentAmount;

        }
        this.payInfo.DocumentInfoId =
          this.creditPaymentControls('documentInfoId').value;
        break;
    }

    if (
      this.payInfo.PaymentAmount <
      this.paymentInfo.paymentGatewayMinimumPayableAmount ||
      (this.paymentInfo.billSummary.payValue <
        this.paymentInfo.paymentGatewayMinimumPayableAmount &&
        (this.paymentInfo.billSummary.payValue >
          this.paymentInfo.paymentMaximumDiscrepancyAmount ||
          this.paymentInfo.billSummary.payValue <
          this.paymentInfo.paymentMaximumDiscrepancyAmount * -1))
    ) {
      this.toastService.showDanger(
        `مبلغ پرداخت و یا باقیمانده فاکتور معتبر نیست.`
      );
      return;
    }
    if (this.discountResult != undefined) {
      if (
        this.discountResult.needDiscountCodeConfirmation &&
        (this.discountParams.DiscountCode.ConfirmationCode == '' ||
          this.discountParams.DiscountCode.ConfirmationCode == null)
      ) {
        this.toastService.showWarning(
          'لطفا کد تاییدیه مربوط به کد تخفیف را وارد نمایید.'
        );
        return;
      }
      this.payInfo.Discount = this.discountParams;
    } else if (
      this.sellerDiscountResult != undefined ||
      this.sellerSpecialDiscountResult != undefined
    ) {
      this.payInfo.Discount = {
        DiscountCode:
          this.sellerDiscountResult == undefined
            ? null
            : {
              DiscountCode: this.discountControls('discountCode').value,
            },
        SpecialDiscount:
          this.sellerSpecialDiscountResult == undefined
            ? null
            : {
              SpecialDiscountPercent: Number(
                this.specialDiscountControls('specialDiscountPercent').value
              ),
              SpecialDiscountDescription: this.specialDiscountControls(
                'specialDiscountDescription'
              ).value,
              ManagementDiscountDetails:
                this.specialDiscountDetails().controls.map((control) => {
                  control.value.discountPercent =
                    +control.value.discountPercent;
                  return control.value;
                }),
            },
      };
    } else {
      delete this.payInfo.Discount;
    }
    if (this.payInfo.PaymentMethod === this.paymentMethod.CreditPayment) {
      this.creditPaymentForm.disable({ emitEvent: false });
    }
    this.isSubmitting = true;
    this.cartService
      .payInvoice(this.payInfo)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe(
        (response) => {
          const responseData = response.data;
          if (this.paymentInfo.invoicePayments === null)
            this.paymentInfo.invoicePayments = [];

          this.paymentInfo.invoicePayments.push({
            id: responseData.paymentId,
            invoiceId: responseData.invoiceId,
            messageResult: '',
            paymentAmount: this.payInfo.PaymentAmount,
            paymentMethod: this.payInfo.PaymentMethod,
            referenceNumber: referenceNumber,
            status: responseData.paymentStatus,
            chequeNumber: this.payInfo.ChequePayment
              ? this.payInfo.ChequePayment.ChequeNumber
              : null,
            chequeDate: this.payInfo.ChequePayment
              ? this.payInfo.ChequePayment.ChequeDate
              : null,
            trackingNumber: trackingNumber,
            transactionDate: transactionDate,
            orderBy: this.payInfo.SettlementCommandPayment
              ? this.payInfo.SettlementCommandPayment.OrderBy
              : null,
            creditPaymentMethod: this.payInfo.CreditPayment
              ? this.payInfo.CreditPayment.CreditPaymentMethod
              : null,
          });
          this.creditPaymentControls('creditSalesContractId').disable({
            emitEvent: false,
          });
          this.creditPaymentControls('creditPaymentMethod').disable({
            emitEvent: false,
          });

          this.successPayment = true;
          switch (this.payInfo.PaymentMethod) {
            case this.paymentMethod.Ipg:
              let hiddenFields = [];
              switch (this.payInfo.IpgPayment.PaymentGateway) {
                case this.paymentGateway.AsanPardakht:
                  hiddenFields = [
                    `<input type="hidden" name='RefId' value='${responseData.ipgPaymentToken}'>`,
                  ];
                  this.submitPaymentToken(
                    hiddenFields,
                    'https://asan.shaparak.ir'
                  );
                  break;
                case this.paymentGateway.BehPardakht:
                  hiddenFields = [
                    `<input type="hidden" name='RefId' value='${responseData.ipgPaymentToken}'>`,
                  ];
                  this.submitPaymentToken(
                    hiddenFields,
                    'https://bpm.shaparak.ir/pgwchannel/startpay.mellat'
                  );
                  break;
                case this.paymentGateway.Refah:
                  hiddenFields = [
                    `<input type="hidden" name='Token' value='${responseData.ipgPaymentToken}'>`,
                    '<input name="GetMethod" type="text" value="true"',
                  ];
                  this.submitPaymentToken(
                    hiddenFields,
                    'https://sep.shaparak.ir/OnlinePG/OnlinePG'
                  );
                  break;
              }
              break;
            case this.paymentMethod.CreditPayment:
              let hiddenField = [];
              switch (this.payInfo.CreditPayment.CreditPaymentMethod) {
                case this.creditPaymentMethod.MehrBankCreditPaymentWithCard:
                  hiddenField = [
                    `<input type="hidden" name='transaction-id' value='${responseData.ipgPaymentToken}'>`,
                    `<input type="hidden" name='sign' value='${responseData.ipgPaymentSign}'>`,
                  ];
                  this.submitPaymentToken(
                    hiddenField,
                    'https://kalayiranipg.qmb.ir/pg/pay'
                  );
                  break;
                case this.creditPaymentMethod.Azkivam:
                  window.open(responseData.ipgPaymentUrl, '_self');
                  break;
                case this.creditPaymentMethod.PostBankCreditPaymentWithCredit:
                  window.open(
                    `https://pec.shaparak.ir/NewIPG/?token=${responseData.ipgPaymentToken}`,
                    '_self'
                  );
                  break;
                case this.creditPaymentMethod.BehPardakhtHamiCardCreditPayment:
                  hiddenField = [
                    `<input type="hidden" name='RefId' value='${responseData.ipgPaymentToken}'>`,
                  ];
                  this.submitPaymentToken(
                    hiddenField,
                    'https://bpm.shaparak.ir/pgwchannel/startpay.mellat'
                  );
                  break;
                case this.creditPaymentMethod.BehPardakhtShopCardCreditPayment:
                  hiddenField = [
                    `<input type="hidden" name='RefId' value='${responseData.ipgPaymentToken}'>`,
                  ];
                  this.submitPaymentToken(
                    hiddenField,
                    'https://bpm.shaparak.ir/pgwchannel/startpay.mellat'
                  );
                  break;
                case this.creditPaymentMethod.AyandehTaravat:
                  this.payInvoiceData = responseData;
                  this.qrCodeValue = this.payInvoiceData.qrCodeValue;
                  this.openQrModal();
                  break;
                case this.creditPaymentMethod.BetaCreditPayment:
                  this.creditPaymentControls('paymentAmount').setValue(this.betaPaymentAmount);
                  this.updateInvoice(responseData);
                  break;
                default:                  
                  this.updateInvoice(responseData);
              }
              break;
            case this.paymentMethod.NeshanPardakht:
            case this.paymentMethod.OnlinePos:
            case this.paymentMethod.ManualPos:
            case this.paymentMethod.Cheque:
            case this.paymentMethod.SettlementCommand:
            case this.paymentMethod.DepositSlip:
            case this.paymentMethod.CredentialPayment:
            case this.paymentMethod.Pano:
              this.updateInvoice(responseData);
              break;
          }
        },
        ({ error }) => {
          if (error.data != null) {
            const data: IPayInvoiceResult = error.data;
            this.updateUrl(data.invoiceId);
            if (error.data.redirectShipping)
              this.router.navigate(['/cart/shipping'], {
                queryParams: {
                  invoiceKey: this.paymentInfoParams.InvoiceTempKey,
                },
              });
          }
          if (this.payInfo.PaymentMethod === this.paymentMethod.CreditPayment) {
            this.creditPaymentForm.enable({ emitEvent: false });
          }
        }
      );
  }

  openQrModal() {
    this.qrCodeModal = this.modalService.open(QRCodeComponent, {
      centered: true,
      backdrop: 'static',
    });

    this.qrCodeModal.componentInstance.newQrCode.subscribe((qrValue: any) => {
      this.qrCodeValue = qrValue;
    });
    this.qrCodeModal.componentInstance.qrValue = this.qrCodeValue;
    this.qrCodeModal.componentInstance.InvoiceId =
      this.payInvoiceData.invoiceId;
    this.qrCodeModal.componentInstance.data = this.payInfo;
    this.qrCodeModal.componentInstance.stt.subscribe((invoicePayments: any) => {
      this.paymentInfo.invoicePayments = invoicePayments;
      const report: any = this.paymentInfo.invoicePayments.find(
        (v) => v.creditPaymentMethod === 12
      );
      if (report) {
        if (+report.resultCode === 0) {
          this.updateInvoice(this.payInvoiceData);
        }
      }
    });
  }

  findQrStatus(): boolean {
    const report: any = this.paymentInfo.invoicePayments.find(
      (v) => v.creditPaymentMethod === 12
    );
    if (report) {
      if (+report.resultCode === 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  private updateInvoice(data) {    
    this.updateUrl(data.invoiceId);
    this.viewportScroller.scrollToAnchor('payment-history');
    this.paymentInfo.billSummary.paidValue += this.payInfo.PaymentAmount;
    this.paymentInfo.billSummary.remainValue -= this.payInfo.PaymentAmount;
    if (this.payInfo.PaymentMethod == this.paymentMethod.CredentialPayment) {
      this.paymentInfo.billSummary.creditValue -= this.payInfo.PaymentAmount;
    }
    this.updatePayInfo();
    this.resetForms();
    this.getPaymentsStatus();
    this.checkPaymentStatusIntervalState();
  }

  updatePayInfo() {
    this.enableSubmitPayment =
      this.paymentInfo.billSummary.remainValue == 0 ? true : false;
    if (this.paymentInfo.billSummary.remainValue == 0)
      this.payInfo.PaymentMethod = null;
  }

  resetForms() {
    if (this.isSeller) {
      this.onlinePosForm.reset({
        paymentAmount: this.paymentInfo.billSummary.remainValue,
      });
      this.manualPosForm.reset({
        paymentAmount: this.paymentInfo.billSummary.remainValue,
        paymentDate: this.todayDate,
        referenceNumber: '',
        trackingNumber: '',
      });
      this.depositSlipForm.reset({
        paymentAmount: this.paymentInfo.billSummary.remainValue,
        bankAccountsId: this.defaultBankAccount?.bankAccountsId,
        accountNumber: '',
        trackingNumber: '',
        transactionDate: this.todayDate,
      });
      this.chequeForm.reset({
        paymentAmount: this.paymentInfo.billSummary.remainValue,
        bankId: '',
        accountNumber: '',
        chequeNumber: '',
        chequeDate: this.todayDate,
      });
      this.settlementForm.reset({
        paymentAmount: this.paymentInfo.billSummary.remainValue,
      });
      this.neshanPardakhtForm.reset({
        paymentAmount: this.paymentInfo.billSummary.remainValue,
        paymentDate: this.todayDate,
        referenceNumber: '',
      });
      this.panoForm.reset({
        paymentAmount: this.paymentInfo.billSummary.remainValue,
        panoContactNumber: this.paymentInfo.panoContactNumber,
      });
    }
    if (
      this.paymentInfo.paymentMethods.some(
        (item) => item === PaymentMethod.CreditPayment
      )
    ) {
      this.creditPaymentForm.reset({
        paymentAmount: '',
        creditSalesContractId: null,
        creditPaymentMethod: null,
        documentInfoId: null,
        topContractCodeInput: null,
        topContractCode: null,
      });
    }
  }

  removePaymentStatusTimer() {
    this.paymentStatusTimer = 0;
    this.updatePaymentHistoryBtn = false;
    this.paymentStatusSubscription &&
      this.paymentStatusSubscription.unsubscribe();
    this.paymentStatusSubscription = undefined;
    this.paymentStatusTimerSubscription &&
      this.paymentStatusTimerSubscription.unsubscribe();
    this.paymentStatusTimerSubscription = undefined;
    const needCheck = this.paymentInfo.invoicePayments?.filter((item) => {
      return (
        item.status == PaymentStatus.PendingVerification &&
        !(
          item.paymentMethod == this.paymentMethod.CreditPayment &&
          (item.creditPaymentMethod ===
            this.creditPaymentMethod.MehrBankCreditPaymentWithoutCard ||
            item.creditPaymentMethod ===
            this.creditPaymentMethod.PostBankCreditPaymentWithCredit ||
            item.creditPaymentMethod ===
            this.creditPaymentMethod.RefahBankCreditPayment)
        )
      );
    });
    if (needCheck != undefined && needCheck.length > 0 && this.isSeller)
      this.updatePaymentHistoryBtn = true;
  }

  checkPaymentStatusIntervalState() {
    const needCheck = this.paymentInfo.invoicePayments?.filter((item) => {
      return (
        item.status == PaymentStatus.PendingVerification &&
        (item.paymentMethod == this.paymentMethod.OnlinePos ||
          item.paymentMethod == this.paymentMethod.NeshanPardakht ||
          item.paymentMethod == this.paymentMethod.ManualPos ||
          item.paymentMethod == this.paymentMethod.CreditPayment)
      );
    });
    if (!needCheck || needCheck.length === 0)
      this.updatePaymentHistoryBtn = true;
    if (needCheck != undefined && needCheck.length > 0) {
      this.removePaymentStatusTimer();
      this.paymentStatusTimer = 3 * 60;
      const source = interval(this.paymentStatusInterval);
      this.paymentStatusSubscription = source.subscribe((val) =>
        this.getPaymentsStatus()
      );
      const sourceTimer = interval(1000);
      this.paymentStatusTimerSubscription = sourceTimer.subscribe((val) =>
        this.getPaymentStatusTimer()
      );
    } else if (this.paymentStatusSubscription != undefined) {
      this.removePaymentStatusTimer();
    }
  }

  getPaymentStatusTimer() {
    this.paymentStatusTimer--;
    if (this.paymentStatusTimer <= 0) {
      this.removePaymentStatusTimer();
    }
  }

  getPaymentsStatus(isLoading: boolean = false) {
    this.paymentStatusLoading = isLoading;
    if (this.payInfo.InvoiceId != undefined)
      this.cartService
        .getInvoiceBillSummary(this.payInfo.InvoiceId)
        .subscribe((response) => {
          var tmpRemainValue: number = this.paymentInfo.billSummary.remainValue;
          this.paymentStatusLoading = false;
          this.paymentInfo.invoicePayments = response.data.invoicePayments;
          this.paymentInfo.billSummary = response.data.billSummary;
          this.paymentInfo.invoiceDataDto.invoiceStatus =
            response.data.invoiceStatus;
          const creditPayments = this.paymentInfo.invoicePayments.filter(
            (item) => item.paymentMethod === PaymentMethod.CreditPayment
          );
          if (
            creditPayments.every(
              (item) =>
                item.status === PaymentStatus.Unverified ||
                item.status === PaymentStatus.Failed ||
                item.status === PaymentStatus.Canceled
            )
          ) {
            this.creditPaymentForm.enable({ emitEvent: false });
          }
          this.updatePayInfo();
          if (tmpRemainValue != response.data.billSummary.remainValue)
            this.resetForms();
          this.findContinueBtn(creditPayments);
        });
  }

  removePaymentItem(item: InvoicePayment) {
    this.cartService
      .removeInvoicePayment({ InvoiceId: item.invoiceId, PaymentId: item.id })
      .subscribe((response) => {
        this.paymentInfo.invoicePayments = response.data.invoicePayments;
        this.paymentInfo.billSummary = response.data.billSummary;
        this.enableSubmitPayment = false;
        this.resetForms();
        this.getPaymentsStatus();
      });
  }

  updateUrl(invoiceId: string) {    
    if (this.route.snapshot.queryParams['invoiceId'] != undefined) return;
    this.orderService.setCartQuantity();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        invoiceId: invoiceId,
        invoiceKey: this.payInfo.InvoiceTempKey,
      },
    });
    this.payInfo.InvoiceShippingTempKey = null;
  }

  submitPaymentToken(hiddenFields: string[], url: string) {
    var form = document.createElement('form');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', url);
    form.setAttribute('target', '_self');
    hiddenFields.forEach((item) => {
      form.insertAdjacentHTML('beforeend', item);
    });
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  updateDiscountCode(discountCode: string) {
    this.discountParams.DiscountCode.DiscountCode = discountCode;
  }

  updateDiscountConfirmationCode(confirmationCode: string) {
    this.discountParams.DiscountCode.ConfirmationCode = confirmationCode;
  }

  checkDiscountCode() {
    if (this.discountParams.DiscountCode.DiscountCode == '') {
      this.toastService.showDanger('کد تخفیف را وارد نمایید.');
      return;
    }
    if (
      this.discountResult !== undefined &&
      this.discountResult.needDiscountCodeConfirmation &&
      (this.discountParams.DiscountCode.ConfirmationCode == '' ||
        this.discountParams.DiscountCode.ConfirmationCode == null)
    ) {
      this.toastService.showDanger('کد تاییدیه را وارد نمایید.');
      return;
    }
    this.discountParams.CustomerId = this.paymentInfo.invoiceDataDto.customerId;
    this.discountParams.DiscountCode.VerifyConfirmationCode =
      !!this.discountParams.DiscountCode.ConfirmationCode;
    this.cartService
      .checkDiscountCode(this.discountParams)
      .subscribe((response) => {
        this.discountResult = response.data;
        this.updatePaymentAfterDiscount();
      });
  }

  removeDiscountCode() {
    this.cartService
      .removeDiscountCode(
        this.paymentInfoParams.InvoiceShippingTempKey,
        this.paymentInfo.invoiceDataDto.customerId
      )
      .subscribe((response) => {
        this.paymentInfo.billSummary = response.data.billSummary;
        this.paymentInfo.paymentGateways = response.data.paymentGateways;

        this.discountCodeInput.nativeElement.value = null;
        this.confirmationCodeInput.nativeElement.value = null;

        this.discountResult = undefined;
        this.discountParams.DiscountCode.DiscountCode = '';
        this.discountParams.DiscountCode.ConfirmationCode = '';
        this.discountParams.DiscountCode.VerifyConfirmationCode = null;
      });
  }

  updatePaymentAfterDiscount() {
    if (this.discountResult.needDiscountCodeConfirmation) {
      this.toastService.showInfo('لطفا کد تاییدیه را وارد نمایید.');
      return;
    }
    this.paymentInfo.billSummary = this.discountResult.billSummary;
    this.paymentInfo.paymentGateways = this.discountResult.paymentGateways;
  }

  submitSellerDiscount() {
    const discountParams: IDiscountCheckParams = {
      CustomerId: this.paymentInfo.invoiceDataDto.customerId,
      DiscountCode: {
        DiscountCode: this.discountControls('discountCode').value,
      },
      SpecialDiscount:
        this.sellerSpecialDiscountResult == undefined
          ? null
          : {
            SpecialDiscountPercent: Number(
              this.specialDiscountControls('specialDiscountPercent').value
            ),
            SpecialDiscountDescription: this.specialDiscountControls(
              'specialDiscountDescription'
            ).value,
          },
      InvoiceShippingTempKey: this.payInfo.InvoiceShippingTempKey,
    };
    this.cartService.checkDiscountCode(discountParams).subscribe((response) => {
      this.sellerDiscountResult = response.data;
      this.paymentInfo.billSummary = this.sellerDiscountResult.billSummary;
      this.resetForms();
    });
  }

  submitSellerSpecialDiscount() {
    this.specialDiscountForm.disable();
    const discountParams: IDiscountCheckParams = {
      CustomerId: this.paymentInfo.invoiceDataDto.customerId,
      DiscountCode:
        this.sellerDiscountResult == undefined
          ? null
          : {
            DiscountCode: this.discountControls('discountCode').value,
          },
      SpecialDiscount: {
        SpecialDiscountPercent: Number(
          this.specialDiscountControls('specialDiscountPercent').value
        ),
        SpecialDiscountDescription: this.specialDiscountControls(
          'specialDiscountDescription'
        ).value,
      },
      InvoiceShippingTempKey: this.payInfo.InvoiceShippingTempKey,
    };
    this.cartService.checkDiscountCode(discountParams).subscribe(
      (response) => {
        this.sellerSpecialDiscountResult = response.data;
        this.paymentInfo.billSummary =
          this.sellerSpecialDiscountResult.billSummary;
        this.resetForms();
      },
      () => {
        this.specialDiscountForm.enable();
      }
    );
  }

  removeSellerDiscount() {
    this.cartService
      .removeDiscountCode(
        this.paymentInfoParams.InvoiceShippingTempKey,
        this.paymentInfo.invoiceDataDto.customerId
      )
      .subscribe((response) => {
        this.paymentInfo.billSummary = response.data.billSummary;
        this.sellerDiscountResult = undefined;
        this.sellerSpecialDiscountResult = undefined;
        this.discountForm.reset();
        this.specialDiscountForm.reset();
        this.specialDiscountDetails().controls.forEach((group, index) => {
          if (this.specialDiscountDetails().controls.length > 1)
            this.specialDiscountDetails().removeAt(index);
        });
        this.specialDiscountForm.enable();
        this.resetForms();
      });
  }

  backToShipping() {
    this.router.navigate(['/cart/shipping'], {
      queryParams: { invoiceKey: this.paymentInfoParams.InvoiceTempKey },
    });
  }

  printPreInvoice(showOrderInfo: boolean = false) {
    let url = `${environment.apiUrl}/Report/`;
    url += showOrderInfo
      ? 'PrintOrderInformationReport?ReportName=OrderInformation'
      : 'PrintPreInvoiceReport?ReportName=PreInvoice';
    url += `&InvoiceShippingTempKey=${this.payInfo.InvoiceShippingTempKey}&InvoiceTempKey=${this.payInfo.InvoiceTempKey}`;

    if (
      this.sellerDiscountResult != undefined ||
      this.sellerSpecialDiscountResult != undefined
    ) {
      url +=
        this.sellerDiscountResult == undefined
          ? ''
          : `&DiscountCode=${this.discountControls('discountCode').value}`;
      url +=
        this.sellerSpecialDiscountResult == undefined
          ? ''
          : `&SpecialDiscountPercent=${this.specialDiscountControls('specialDiscountPercent').value
          }&SpecialDiscountDescription=${this.specialDiscountControls('specialDiscountDescription').value
          }`;
    }

    window.open(url, '_blank');
  }

  getOnlinePoses() {
    return this.paymentInfo.posIpAddresses.filter((item) => {
      return item.onlinePos == true;
    });
  }

  getPaymentMethodsLength() {
    return this.paymentInfo.paymentMethods.filter((item) => {
      return item != this.paymentMethod.Ipg;
    });
  }

  onContinuePayment(elem): void {
    const paymentId = this.paymentInfo.invoicePayments.find(
      (item) =>
        item.paymentMethod === PaymentMethod.CreditPayment &&
        item.status === PaymentStatus.PendingVerification
    ).id;

    if (
      this.continuePaymentBtn.creditPaymentMethod ===
      CreditPaymentMethod.MehrBankCreditPaymentWithoutCard
    ) {
      this.continueMehrPayment(paymentId, elem);
    }
    if (
      this.continuePaymentBtn.creditPaymentMethod ===
      CreditPaymentMethod.PostBankCreditPaymentWithoutCredit
    ) {
      this.continuePostBankPayment(paymentId, elem);
    }
  }

  continueMehrPayment(paymentId: number, elem) {
    const MehrIpgModalRef = this.modalService.open(
      MehrIpgConfirmationComponent,
      { centered: true }
    );
    MehrIpgModalRef.componentInstance.onConfirmationButton.subscribe(() => {
      elem.setAttribute('disabled', 'disabled');
      this.http
        .post<IResponse<PayMehrBankCreditPayment>>(
          `${environment.apiUrl}/Payment/CompleteCreditPayment`,
          { paymentId }
        )
        .pipe(finalize(() => elem.removeAttribute('disabled')))
        .subscribe((response) => {
          let hiddenFields = [
            `<input type="hidden" name='transaction-id' value='${response.data.transactionId}'>`,
            `<input type="hidden" name='sign' value='${response.data.sign}'>`,
          ];
          this.submitPaymentToken(
            hiddenFields,
            'https://kalayiranipg.qmb.ir/pg/pay'
          );
        });
    });
  }

  continuePostBankPayment(paymentId: number, elem) {
    const postBankConfModalRef = this.modalService.open(
      PostBankConfirmationComponent,
      { centered: true }
    );
    postBankConfModalRef.componentInstance.onConfirmationButton.subscribe(
      () => {
        elem.setAttribute('disabled', 'disabled');
        this.http
          .post<IResponse<any>>(
            `${environment.apiUrl}/Payment/CompleteCreditPayment`,
            { paymentId }
          )
          .pipe(finalize(() => elem.removeAttribute('disabled')))
          .subscribe((response) => {
            window.open(
              `https://pec.shaparak.ir/NewIPG/?token=${response.data.transactionId}`,
              '_self'
            );
          });
      }
    );
  }
}
