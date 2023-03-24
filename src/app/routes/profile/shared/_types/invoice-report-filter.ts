import { InvoiceStatus } from '..';

export type InvoiceReportFilter = {
  saleInvoiceNumber?: string;
  customerFullName?: string;
  startDate?: string;
  endDate?: string;
  status?: InvoiceStatus;
  cooperatorId?: number;
};
