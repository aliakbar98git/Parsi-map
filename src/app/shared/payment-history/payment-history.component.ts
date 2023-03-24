import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import {
  faQrcode, faFileInvoice, faCreditCard, IconDefinition, faReceipt, faMoneyCheck, faHandPaper, faSpinner, faTimes, faDatabase,
  faMoneyBillWaveAlt
} from '@fortawesome/free-solid-svg-icons';
import { faInternetExplorer, faPaypal } from '@fortawesome/free-brands-svg-icons';
import { InvoicePayment, InvoiceStatus } from 'src/app/routes/profile/shared';
import { PaymentMethod, PaymentStatus, TranslateService } from '..';
import { UserType } from './../../routes/user/shared/_enums/userType.enum';
import { UserService } from 'src/app/routes/user/shared';
import { JalaliPipe } from '@shared/_pipes/jalali.pipe';
import { CreditPaymentMethod } from 'src/app/routes/cart/shared/credit-payment-method';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss'],
  providers: [DecimalPipe]
})
export class PaymentHistoryComponent implements OnInit {
  @Input() paymentInfo: InvoicePayment;
  @Input() invoiceStatus: InvoiceStatus;
  @Output() removePaymentItem: EventEmitter<any> = new EventEmitter();
  itemClass: string;
  itemIcon: any;
  itemMessage: string;
  paymentStatus: typeof PaymentStatus;
  paymentMethod: typeof PaymentMethod;
  creditPaymentMethod: typeof CreditPaymentMethod;
  isRemovable: boolean = false;
  faSpinner = faSpinner;
  faTimes = faTimes;
  faDatabase = faDatabase;
  faPaypal = faPaypal;
  faMoneyBillWaveAlt = faMoneyBillWaveAlt;
  jalaliPipe;

  constructor(
    private decimalPipe: DecimalPipe,
    private userService: UserService,
    private translateService: TranslateService
  ) {
    this.jalaliPipe = new JalaliPipe();
  }

  ngOnInit(): void {
    this.paymentStatus = PaymentStatus;
    this.paymentMethod = PaymentMethod;
    this.creditPaymentMethod = CreditPaymentMethod;
    this.itemClass = this.getClassName(this.paymentInfo.status);
    this.itemIcon = this.getIconName(this.paymentInfo.paymentMethod);
    this.itemMessage = this.getMessage(this.paymentInfo);
    if ((this.paymentInfo.paymentMethod == PaymentMethod.CreditPayment &&
      (this.paymentInfo.status === this.paymentStatus.Pending ||
        this.paymentInfo.status !== this.paymentStatus.PendingVerificationForFinanceDepartment)
      &&
      (this.paymentInfo.creditPaymentMethod === this.creditPaymentMethod.PostBankCreditPaymentWithCredit ||
        this.paymentInfo.creditPaymentMethod === this.creditPaymentMethod.BehPardakhtHamiCardCreditPayment ||
        this.paymentInfo.creditPaymentMethod === this.creditPaymentMethod.BehPardakhtShopCardCreditPayment ||
        this.paymentInfo.creditPaymentMethod === this.creditPaymentMethod.MehrBankCreditPaymentWithCard ||
        this.paymentInfo.creditPaymentMethod === this.creditPaymentMethod.BetaCreditPayment
      )) ||
      (this.paymentInfo.paymentMethod != PaymentMethod.OnlinePos &&
        this.paymentInfo.paymentMethod != PaymentMethod.Pano &&
        this.paymentInfo.paymentMethod != PaymentMethod.CreditPayment &&
        this.userService.currentUser?.userType == UserType.Seller && (
          this.invoiceStatus == InvoiceStatus.Pending ||
          this.invoiceStatus == InvoiceStatus.PartialPayment ||
          this.invoiceStatus == InvoiceStatus.PendingVerification ||
          this.invoiceStatus == InvoiceStatus.Unverified ||
          this.invoiceStatus == InvoiceStatus.AutomaticCanceled ||
          this.invoiceStatus == InvoiceStatus.Canceled)
      )
    )
      this.isRemovable = true;
  }


  private getClassName(status: PaymentStatus): string {
    let className = '';
    switch (status) {
      case this.paymentStatus.Pending:
      case this.paymentStatus.PendingVerification:
        className = 'alert-info';
        break;
      case this.paymentStatus.Verified:
        className = 'alert-success';
        break;
      case this.paymentStatus.Unverified:
      case this.paymentStatus.Canceled:
      case this.paymentStatus.Failed:
        className = 'alert-danger';
        break;
      case this.paymentStatus.FailedVerification:
        className = 'alert-secondary';
        break;
    }
    return className;
  }

  private getIconName(paymentMethod: PaymentMethod): IconDefinition {
    let iconName;
    switch (paymentMethod) {
      case this.paymentMethod.Ipg:
        iconName = faInternetExplorer;
        break;
      case this.paymentMethod.OnlinePos:
        iconName = faCreditCard;
        break;
      case this.paymentMethod.ManualPos:
        iconName = faReceipt;
        break;
      case this.paymentMethod.NeshanPardakht:
        iconName = faQrcode;
        break;
      case this.paymentMethod.Cheque:
        iconName = faMoneyCheck;
        break;
      case this.paymentMethod.SettlementCommand:
        iconName = faHandPaper;
        break;
      case this.paymentMethod.DepositSlip:
        iconName = faFileInvoice;
        break;
      case this.paymentMethod.CredentialPayment:
        iconName = faDatabase;
        break;
      case this.paymentMethod.Pano:
        iconName = faPaypal;
        break;
      case this.paymentMethod.CreditPayment:
        iconName = faMoneyBillWaveAlt;
        break;
    }
    return iconName;
  }

  private getMessage(item: InvoicePayment): string {
    let message = '';
    switch (item.status) {
      case this.paymentStatus.Pending:
        switch (item.paymentMethod) {
          case this.paymentMethod.OnlinePos:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال از طریق دستگاه کارتخوان در انتطار پرداخت می باشد.`;
            break;
          case this.paymentMethod.CreditPayment:
            if (item.creditPaymentMethod === this.creditPaymentMethod.MehrBankCreditPaymentWithCard) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه کالا کارت بانک مهر با وضعیت در انتظار ثبت گردید.`;
              break;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.Azkivam) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه "ازکی‌وام" با وضعیت در انتظار ثبت گردید.`;
              break;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.PostBankCreditPaymentWithCredit) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه تجارت الکترونیک پارسیان با وضعیت در انتظار ثبت گردید.`;
              break;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.BehPardakhtHamiCardCreditPayment) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه به پرداخت ملت با وضعیت در انتظار ثبت گردید.`;
              break;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.BehPardakhtShopCardCreditPayment) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه به پرداخت ملت با وضعیت در انتظار ثبت گردید.`;
              break;
            }
            else if (item.creditPaymentMethod === this.creditPaymentMethod.AyandehTaravat) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه اعتباری بانک آینده با وضعیت در انتظار ثبت گردید.`;
              break;
            }
            else if (item.creditPaymentMethod === this.creditPaymentMethod.MehrOrganPaymentWithCard) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه کالا کارت بانک مهر با وضعیت در انتظار ثبت گردید.`;
              break;
            }
          default:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در انتظار پرداخت می باشد.`;
        }
        break;
      case this.paymentStatus.PendingVerification:
        switch (item.paymentMethod) {
          case this.paymentMethod.OnlinePos:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال از طریق دستگاه کارتخوان با وضعیت در انتظار تایید ثبت گردید.`;
            break;
          case this.paymentMethod.ManualPos:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال از طریق ثبت مشخصات رسید دستگاه کارتخوان به شماره پیگیری ${item.trackingNumber} درتاریخ ${this.jalaliPipe.transform(item.transactionDate)} با وضعیت در انتظار تایید ثبت گردید.`;
            break;
          case this.paymentMethod.NeshanPardakht:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به روش نشان پرداخت به شماره ارجاع ${item.referenceNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} با وضعیت در انتظار تایید ثبت گردید.`;
            break;
          case this.paymentMethod.Ipg:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال از طریق درگاه پرداخت اینترنتی در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} با وضعیت در انتظار تایید ثبت گردید.`;
            break;
          case this.paymentMethod.Cheque:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال با شماره چک ${item.chequeNumber} و تاریخ چک ${this.jalaliPipe.transform(item.chequeDate)} با وضعیت در انتظار تایید ثبت گردید.`;
            break;
          case this.paymentMethod.DepositSlip:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به شماره پیگیری رسید ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} با وضعیت در انتظار تایید ثبت گردید.`;
            break;
          case this.paymentMethod.SettlementCommand:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به روش دستور تسویه به درخواست ${item.orderBy} با وضعیت در انتظار تایید ثبت گردید.`;
            break;
          case this.paymentMethod.CredentialPayment:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به روش بستانکاری با وضعیت در انتظار تایید ثبت گردید.`;
            break;
          case this.paymentMethod.Pano:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال از طریق درگاه پرداخت پانو به شماره ارجاع ${item.referenceNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} با وضعیت در انتظار تایید ثبت گردید.`;
            break;
          case this.paymentMethod.CreditPayment:
            if (item.creditPaymentMethod === this.creditPaymentMethod.MehrBankCreditPaymentWithCard) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه کالا کارت بانک مهر با وضعیت در انتظار تایید ثبت گردید.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.MehrBankCreditPaymentWithoutCard) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} با روش اعتباری بانک مهر – فاقد کالا کارت با وضعیت در انتظارتایید ثبت گردید.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.Azkivam) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه "ازکی‌وام" با وضعیت در انتظارتایید ثبت گردید.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.Vamine) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} بابت تراکنش اعتباری وامینه با وضعیت در انتظارتایید ثبت گردید.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.PostBankCreditPaymentWithCredit) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه تجارت الکترونیک پارسیان با وضعیت در انتظار تایید ثبت گردید.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.BehPardakhtHamiCardCreditPayment) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه به پرداخت ملت با وضعیت در انتظار تایید ثبت گردید.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.BehPardakhtShopCardCreditPayment) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه به پرداخت ملت با وضعیت در انتظار تایید ثبت گردید.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.BehPardakhtDepositToAccountCreditPayment) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} با روش اعتباری واریز به حساب بانک ملت با وضعیت در انتظار تایید ثبت گردید.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.PostBankCreditPaymentWithoutCredit) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)}   با روش "اعتباری پست بانک – فاقد اعتبار" با وضعیت در انتظار تایید ثبت گردید .`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.AyandehTaravat) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه اعتباری بانک آینده با وضعیت در انتظار تایید ثبت گردید.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.MehrOrganPaymentWithCard) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه کالا کات بانک مهر با وضعیت در انتظار تایید ثبت گردید.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.MehrOrganPaymentWithoutCard) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} با روش" فروش سازمانی مهر – بدون کالا کارت " با وضعیت در انتظار تایید ثبت گردید.`;
            } else {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} با روش پرداخت ${this.translateService.translateEnum(this.creditPaymentMethod[item.creditPaymentMethod])} با وضعیت در انتظار تایید ثبت گردید.`;
            }
            break;
        }
        break;
      case this.paymentStatus.Verified:
        switch (item.paymentMethod) {
          case this.paymentMethod.OnlinePos:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال از طریق دستگاه کارتخوان به شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} تاییدگردید.`;
            break;
          case this.paymentMethod.Cheque:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال با شماره چک ${item.chequeNumber} و تاریخ چک ${this.jalaliPipe.transform(item.chequeDate)} تایید گردید.`;
            break;
          case this.paymentMethod.DepositSlip:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به شماره پیگیری رسید ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} تایید گردید.`;
            break;
          case this.paymentMethod.ManualPos:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال از طریق ثبت مشخصات رسید دستگاه کارتخوان به شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} تایید گردید.`;
            break;
          case this.paymentMethod.NeshanPardakht:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به روش نشان پرداخت به شماره ارجاع ${item.referenceNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} تایید گردید.`;
            break;
          case this.paymentMethod.SettlementCommand:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به روش دستور تسویه به درخواست ${item.orderBy} تایید گردید.`;
            break;
          case this.paymentMethod.CredentialPayment:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به روش بستانکاری تایید گردید.`;
            break;
          case this.paymentMethod.Ipg:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال از طریق درگاه پرداخت اینترنتی در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} تایید شده است.`;
            break;
          case this.paymentMethod.Pano:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال از طریق درگاه پرداخت پانو به شماره ارجاع ${item.referenceNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} تایید گردید.`;
            break;
          case this.paymentMethod.CreditPayment:
            if (item.creditPaymentMethod === this.creditPaymentMethod.MehrBankCreditPaymentWithCard) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه کالا کارت بانک مهر تایید گردید.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.Azkivam) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه"ازکی‌وام" تایید گردید.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.Vamine) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} بابت تراکنش اعتباری وامینه تایید گردید.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.PostBankCreditPaymentWithCredit) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه تجارت الکترونیک پارسیان تایید گردید.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.BehPardakhtHamiCardCreditPayment) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه به پرداخت ملت تایید گردید.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.BehPardakhtShopCardCreditPayment) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه به پرداخت ملت تایید گردید.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.BehPardakhtDepositToAccountCreditPayment) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} با روش اعتباری بانک ملت واریز به حساب تایید گردیده است.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.AyandehTaravat) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)}  از طریق درگاه اعتباری بانک آینده تایید گردید.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.BetaCreditPayment) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)}  بابت تراکنش بتا تایید شده است.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.MehrOrganPaymentWithCard) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه کالا کارت بانک مهر تایید گردید.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.MehrOrganPaymentWithoutCard) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} با روش " فروش سازمانی مهر – بدون کالا کارت" با وضعیت تایید شده ثبت شده است .`;
            } else {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} با روش پرداخت ${this.translateService.translateEnum(this.creditPaymentMethod[item.creditPaymentMethod])} تایید گردید.`;
            }
            break;
        }
        break;
      case this.paymentStatus.Unverified:
        switch (item.paymentMethod) {
          case this.paymentMethod.OnlinePos:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال از طریق دستگاه کارتخوان عدم تاییدگردید.`;
            break;
          case this.paymentMethod.Cheque:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال با شماره چک ${item.chequeNumber} و تاریخ چک ${this.jalaliPipe.transform(item.chequeDate)} عدم تایید گردید. `;
            break;
          case this.paymentMethod.DepositSlip:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به شماره پیگیری رسید ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} عدم تایید گردید.`;
            break;
          case this.paymentMethod.ManualPos:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال از طریق ثبت مشخصات رسید دستگاه کارتخوان به شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} عدم تایید گردید.`;
            break;
          case this.paymentMethod.NeshanPardakht:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به روش نشان پرداخت به شماره ارجاع ${item.referenceNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} عدم تایید گردید.`;
            break;
          case this.paymentMethod.SettlementCommand:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به روش دستور تسویه به درخواست ${item.orderBy} عدم تایید گردید.`;
            break;
          case this.paymentMethod.CredentialPayment:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به روش بستانکاری عدم تایید گردید.`;
            break;
          case this.paymentMethod.Ipg:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال از طریق درگاه پرداخت اینترنتی در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} عدم تایید شده است.`;
            break;
          case this.paymentMethod.Pano:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال از طریق درگاه پرداخت پانو در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} عدم تایید گردید.`;
            break;
          case this.paymentMethod.CreditPayment:
            if (item.creditPaymentMethod === this.creditPaymentMethod.MehrBankCreditPaymentWithoutCard) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} با روش "اعتباری بانک مهر – فاقد کالا کارت" با وضعیت تایید نشده ثبت شده است.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.Azkivam) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه "ازکی‌وام" عدم تایید پرداخت شده است.`;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.Vamine) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} بابت تراکنش اعتباری وامینه عدم تایید پرداخت شده است.`;
            }
            else if (item.creditPaymentMethod === this.creditPaymentMethod.PostBankCreditPaymentWithCredit) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)}   از طریق درگاه تجارت الکترونیک پارسیان عدم تایید شده است.`;
            }
            else if (item.creditPaymentMethod === this.creditPaymentMethod.BehPardakhtHamiCardCreditPayment) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)}   از طریق درگاه به پرداخت ملت عدم تایید شده است.`;
            }
            else if (item.creditPaymentMethod === this.creditPaymentMethod.BehPardakhtShopCardCreditPayment) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)}   از طریق درگاه به پرداخت ملت عدم تایید شده است.`;
            }
            else if (item.creditPaymentMethod === this.creditPaymentMethod.BehPardakhtDepositToAccountCreditPayment) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)}   با روش اعتباری بانک ملت واریز به حساب با وضعیت تایید نشده ثبت شده است.`;
            }
            else if (item.creditPaymentMethod === this.creditPaymentMethod.PostBankCreditPaymentWithoutCredit) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)}   با روش "اعتباری پست بانک – فاقد اعتبار" با وضعیت عدم تایید ثبت شده است .`;
            }
            else if (item.creditPaymentMethod === this.creditPaymentMethod.BetaCreditPayment) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)}   با روش "اعتباری بتا" با وضعیت عدم تایید پرداخت ثبت شده است .`;
            }
            else if (item.creditPaymentMethod === this.creditPaymentMethod.MehrOrganPaymentWithoutCard) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)}   با روش "فروش سازمانی مهر - بدون کالا کارت" با وضعیت تایید نشده ثبت شده است .`;
            }
            else {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} با روش پرداخت ${this.translateService.translateEnum(this.creditPaymentMethod[item.creditPaymentMethod])} عدم تایید گردید.`;
            }
            break;
        }
        break;
      case this.paymentStatus.FailedVerification:
        switch (item.paymentMethod) {
          case this.paymentMethod.OnlinePos:
            message = `استعلام وضعیت تراکنش ثبت شده از طریق دستگاه کارتخوان به مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال با خطا مواجه گردید.`;
            break;
          case this.paymentMethod.ManualPos:
            message = `استعلام وضعیت تراکنش ثبت شده از طریق ثبت مشخصات رسید دستگاه کارتخوان به مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال و شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} با خطا مواجه گردید.`;
            break;
          case this.paymentMethod.NeshanPardakht:
            message = `استعلام وضعیت تراکنش ثبت شده از طریق نشان پرداخت به مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال و شماره ارجاع ${item.referenceNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} با خطا مواجه گردید.`;
            break;

        }
        break;
      case this.paymentStatus.Canceled:
        switch (item.paymentMethod) {
          case this.paymentMethod.CreditPayment:
            if (item.creditPaymentMethod === this.creditPaymentMethod.MehrBankCreditPaymentWithCard) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه کالا کارت بانک مهر کنسل شده است.`;
              break;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.Azkivam) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه "ازکی‌وام" کنسل شده است.`;
              break;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.PostBankCreditPaymentWithCredit) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)}  از طریق درگاه تجارت الکترونیک پارسیان کنسل شده است.`;
              break;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.BehPardakhtHamiCardCreditPayment) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)}  از طریق درگاه به پرداخت ملت کنسل شده است.`;
              break;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.BehPardakhtShopCardCreditPayment) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)}  از طریق درگاه به پرداخت ملت کنسل شده است.`;
              break;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.AyandehTaravat) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه اعتباری بانک آینده کنسل شده است.`;
              break;
            }
            else if (item.creditPaymentMethod === this.creditPaymentMethod.MehrOrganPaymentWithCard) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به شماره پیگیری ${item.trackingNumber} در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه کالا کارت بانک مهر کنسل شده است.`;
              break;
            }
          default:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال کنسل شده است.`;
        }
        break;
      case this.paymentStatus.Failed:
        switch (item.paymentMethod) {
          case this.paymentMethod.CreditPayment:
            if (item.creditPaymentMethod === this.creditPaymentMethod.MehrBankCreditPaymentWithCard) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه کالا کارت بانک مهر به دلیل خطای پرداخت لغو شده است.`;
              break;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.Azkivam) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)} از طریق درگاه "ازکی‌وام" به دلیل خطای پرداخت لغو شده است.`;
              break;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.PostBankCreditPaymentWithCredit) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)}  از طریق درگاه تجارت الکترونیک پارسیان به دلیل خطای پرداخت لغو شده است.`;
              break;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.BehPardakhtHamiCardCreditPayment) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)}  از طریق درگاه به پرداخت ملت به دلیل خطای پرداخت لغو شده است.`;
              break;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.BehPardakhtShopCardCreditPayment) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)}  از طریق درگاه به پرداخت ملت به دلیل خطای پرداخت لغو شده است.`;
              break;
            } else if (item.creditPaymentMethod === this.creditPaymentMethod.AyandehTaravat) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)}  از طریق درگاه اعتباری بانک آینده به دلیل خطای پرداخت لغو شده است.`;
              break;
            }
            else if (item.creditPaymentMethod === this.creditPaymentMethod.MehrOrganPaymentWithCard) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)}  از طریق درگاه کالا کارت بانک مهر به دلیل خطای پرداخت لغو شده است.`;
              break;
            }
          default:
            message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال به دلیل خطای پرداخت لغو شده است.`;
        }
        break;
      case this.paymentStatus.PendingVerificationForFinanceDepartment:
        switch (item.paymentMethod) {
          case this.paymentMethod.CreditPayment:
            if (item.creditPaymentMethod === this.creditPaymentMethod.BetaCreditPayment) {
              message = `مبلغ ${this.decimalPipe.transform(item.paymentAmount)} ریال در تاریخ ${this.jalaliPipe.transform(item.transactionDate)}  بابت تراکنش اعتباری بتا درانتظار تایید واحد مالی ثبت شده است.`;
            }
        }
        break;
    }
    return message;
  }

  removePayment() {
    this.removePaymentItem.emit(this.paymentInfo);
  }
}