import { IInvoice } from '..';

export type InvoiceGetResult = {
    invoiceList: IInvoice[];
    totalPayValue: number;
    totalRemain: number;
    totalPaid: number;
    totalRows: number;
};
