import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartComponent } from './cart/cart.component';
import { CheckCustomerComponent } from './check-customer/check-customer.component';
import { ShippingComponent } from './shipping/shipping.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentResultComponent } from './payment-result/payment-result.component';
import { PaymentReceiptComponent } from './payment-receipt/payment-receipt.component';

const routes: Routes = [
  { path: '', component: CartComponent },
  { path: 'check-customer', component: CheckCustomerComponent },
  { path: 'shipping', component: ShippingComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'payment-result', component: PaymentResultComponent },
  { path: 'payment-receipt/:invoiceId', component: PaymentReceiptComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
