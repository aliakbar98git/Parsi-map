import { InvoiceStatus } from '..';

export type InvoiceGet = {
  pageNo: number;
  pageSize: number;
  sellerId?: string;
  saleInvoiceNumber?: string;
  customerFullName?: string;
  startDate?: string;
  endDate?: string;
  status?: InvoiceStatus;
  exportExcel?: boolean;
  cooperatorId?: number;
};
