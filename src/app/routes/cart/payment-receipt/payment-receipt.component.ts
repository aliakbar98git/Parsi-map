import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { CheckoutSteps } from './../shared/checkout-step.enum';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { CartService, IPaymentResult, IPaymentResultParam } from '../shared';
import { environment } from '@environments/environment';
import { InvoiceStatus } from '../../profile/shared';
import { ToastService } from '@shared/toast/toast.service';

@Component({
  templateUrl: './payment-receipt.component.html',
  styleUrls: ['./payment-receipt.component.scss']
})
export class PaymentReceiptComponent implements OnInit {
  subscription: Subscription;
  subscriptionQueryParams: Subscription;
  paymentStatusSubscription: Subscription;
  paymentStatusInterval: number = 5 * 1000;
  timerSubscription: Subscription;
  timerInterval: number = 1000;
  timerTotal: number = 180;
  paymentResultParam: IPaymentResultParam;
  paymentResult: IPaymentResult;
  checkoutSteps: typeof CheckoutSteps;
  timerText: string;
  timeOuted: Boolean = false;
  statusUpdated: Boolean = false;
  faPrint = faPrint;
  invoiceKey: string;

  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private cartService: CartService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.checkoutSteps = CheckoutSteps;
  }

  ngOnInit(): void {
    this.title.setTitle('رسید سفارش');
    this.subscriptionQueryParams = this.route.queryParams.subscribe(params => {
      this.invoiceKey = params.invoiceKey
    });
    this.subscription = this.route.params.subscribe(params => {
      this.paymentResultParam = {
        invoiceId: params.invoiceId
      }


      this.getPaymentsStatus()
      this.paymentStatusSubscription = interval(this.paymentStatusInterval).subscribe(val => this.getPaymentsStatus());
      this.updateTimer();
      this.timerSubscription = interval(this.timerInterval).subscribe(val => this.updateTimer());
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.subscriptionQueryParams.unsubscribe();
    this.unSubscribe();
  }

  unSubscribe() {
    this.paymentStatusSubscription && this.paymentStatusSubscription.unsubscribe();
    this.timerSubscription && this.timerSubscription.unsubscribe();
  }

  getPaymentsStatus() {
    this.cartService.getPaymentResult(this.paymentResultParam).subscribe(response => {
      this.paymentResult = response.data;
      if (this.paymentResult.hasCreditPayments) this.timerTotal = 0;
      if (this.paymentResult.invoiceStatus != InvoiceStatus.Unverified && this.paymentResult.invoiceStatus != InvoiceStatus.PartialPayment) {
        if (this.paymentResult.invoiceStatus == InvoiceStatus.Paid) {
          this.statusUpdated = true;
          this.unSubscribe();
        }
      } else {
        this.toastService.showWarning('پرداخت سفارش شما باید تکمیل گردد.');
        this.router.navigate(['/cart/payment'], {
          queryParams: { invoiceId: this.paymentResultParam.invoiceId }
        });
      }
    })
  }

  updateTimer() {
    if (this.timerTotal == 0) {
      this.timeOuted = true;
      this.unSubscribe();
    }
    let min: number = Math.floor(this.timerTotal / 60);
    let sec: number = this.timerTotal - (min * 60);
    let secText = sec < 10 ? '0' + sec : sec;
    this.timerText = min + ' : ' + secText;
    this.timerTotal--;
  }

  print() {
    window.open(`${environment.apiUrl}/Report/PrintReport?ReportName=SaleInvoice&SaleInvoiceId=${this.paymentResultParam.invoiceId}`, '_blank');
  }
}
