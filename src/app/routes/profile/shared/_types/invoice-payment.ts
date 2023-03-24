import { PaymentStatus, PaymentMethod } from '@shared/.';
import { CreditPaymentMethod } from 'src/app/routes/cart/shared/credit-payment-method';


export type InvoicePayment = {
  id: number;
  invoiceId?: string;
  paymentAmount: number;
  referenceNumber: string;
  messageResult: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  chequeNumber: string;
  chequeDate: string;
  trackingNumber: string;
  transactionDate: string;
  orderBy: string;
  creditPaymentMethod: CreditPaymentMethod;
};
