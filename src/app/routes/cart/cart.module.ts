import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart/cart.component';
import { SharedModule } from '@shared/shared.module';
import { UserModule } from '../user/user.module';
import { CartService } from './shared';
import { ShippingComponent } from './shipping/shipping.component';
import { ProfileService } from '../profile/shared';
import { PaymentComponent } from './payment/payment.component';
import { ShippingTimeTableComponent } from './shipping-time-table/shipping-time-table.component';
import { CheckoutStepComponent } from './checkout-step/checkout-step.component';
import { PaymentResultComponent } from './payment-result/payment-result.component';
import { CheckCustomerComponent } from './check-customer/check-customer.component';
import { RegisterCustomerComponent } from './register-customer/register-customer.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaymentReceiptComponent } from './payment-receipt/payment-receipt.component';
import { MehrIpgConfirmationComponent } from './mehr-ipg-confirmation/mehr-ipg-confirmation.component';
import { QRCodeComponent } from './qr-code/qr-code.component';
import { QrCodeModule } from 'ng-qrcode';
import { BetaReceiptComponent } from './beta-receipt/beta-receipt.component';

@NgModule({
  declarations: [
    CartComponent,
    ShippingComponent,
    PaymentComponent,
    ShippingTimeTableComponent,
    CheckoutStepComponent,
    PaymentResultComponent,
    CheckCustomerComponent,
    RegisterCustomerComponent,
    PaymentReceiptComponent,
    MehrIpgConfirmationComponent,
    QRCodeComponent,
    BetaReceiptComponent
    ],
  imports: [
    CommonModule,
    CartRoutingModule,
    SharedModule,
    NgbModule,
    NgxMaskModule.forChild(),
    UserModule,
    NgSelectModule,
    QrCodeModule
  ],
  providers: [
    CartService,
    ProfileService
  ]

})
export class CartModule { }
