import { InvoiceStatus } from './../_enums/invoice-status.enum';

export interface IInvoice {
  invoiceId: string;
  invoiceNumber: string;
  customerId: number;
  payValue: number;
  status: InvoiceStatus;
  customerFullName: string;
  storeId?: number;
  sellerFullName: string;
  paid: number;
  remain: number;
  sellerId?: string;
  createdOn: string;
  persianCreatedOn: string;
  shippingTrackingNumber: string;
  payable: boolean;
}
