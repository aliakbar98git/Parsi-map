import { ShippingPeriod, InvoiceItem, InvoicePayment, InvoiceStatus } from '..';

export type InvoiceDetailGetResult = {
    invoiceId: string;
    invoiceNumber: string;
    transferee: string;
    deliveryDate: string;
    shippingPeriod?: ShippingPeriod;
    exclusiveShipment: boolean;
    shippingMethodTitle: string;
    createdOn: string;
    contactNumber: string;
    cityTitle: string;
    address: string;
    description: string;
    sellerFullName: string;
    customerFullName: string;
    status?: InvoiceStatus;
    remainPayment?: number;
    totalValue?: number;
    taxValue?: number;
    payValue?: number;
    shippingValue?: number;
    invoiceItemList: InvoiceItem[];
    paidList: InvoicePayment[];
    invoiceFlowMapper: {
        finalInvoiceFlowStatus: number;
        invoiceFlowStatusList: number[];
    }
};
