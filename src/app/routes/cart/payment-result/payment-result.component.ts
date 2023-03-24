import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '@environments/environment';
import { CartService, IPaymentResult, IPaymentResultParam } from '../shared';
import { CheckoutSteps } from '../shared/checkout-step.enum';
import { PaymentStatus } from '@shared/.';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

@Component({
  templateUrl: './payment-result.component.html',
  styleUrls: ['./payment-result.component.scss']
})
export class PaymentResultComponent implements OnInit {
  subscription: Subscription;
  paymentResultParam: IPaymentResultParam;
  invalidInput: boolean = true;
  message: string = "مقادیر ورودی معتبر نیستند. لطفا مجدد و با لینک درست تلاش نمایید.";
  faPrint = faPrint;
  paymentResult: IPaymentResult;
  paymentResultMessage: string;
  reportModalRef;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit() {
    this.subscription = this.route.queryParams.subscribe(params => {
      this.paymentResultParam = {
        invoiceId: params.invoiceId,
        ipgPaymentResultTempKey: params.ipgPaymentResultTempKey
      }

      if (
        typeof this.paymentResultParam.invoiceId === "string" && this.paymentResultParam.invoiceId !== "" &&
        typeof this.paymentResultParam.ipgPaymentResultTempKey === "string" && this.paymentResultParam.ipgPaymentResultTempKey != ""
      ) {
        this.invalidInput = false;
        this.getPaymentResult();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public get checkoutSteps(): typeof CheckoutSteps {
    return CheckoutSteps;
  }
  public get paymentStatus(): typeof PaymentStatus {
    return PaymentStatus;
  }

  getPaymentResult() {
    this.cartService.getPaymentResult(this.paymentResultParam).subscribe(response => {
      if (response.data.hasRemainPayment) {
        this.router.navigate(['/cart/payment'], { queryParams: {
          invoiceId: response.data.invoiceId
          }
        });
        return;
      }
      this.paymentResult = response.data;
      switch (response.data.paymentStatus) 
      { 
        case PaymentStatus.Failed:
          this.paymentResultMessage = 'متاسفانه پرداخت سفارش شما موفقیت آمیز نبود. چنانچه اگر از حساب شما مبلغی کم شده باشد طی ۷۲ ساعت به حساب شما بازخواهد گشت.';
          break;
        case PaymentStatus.Verified:
          this.paymentResultMessage = 'سفارش شما با موفقیت پرداخت شد.';
          break;
        case PaymentStatus.Canceled:
          this.paymentResultMessage = 'شما از پرداخت سفارش خود منصرف شدید.';
          break;
      } 
      
    }, ({error}) => {
      this.invalidInput = true;
      this.message = error.message;
    })
  }

  printInvoice() {
    window.open(`${environment.apiUrl}/Report/PrintReport?ReportName=SaleInvoice&SaleInvoiceId=${this.paymentResult.invoiceId}`, '_blank');
  }
}
