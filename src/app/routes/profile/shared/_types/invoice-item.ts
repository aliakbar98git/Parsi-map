import { ImageType } from '@shared/.';

export type InvoiceItem = {
    documentInfoId: string;
    imageType?: ImageType;
    marketingProductModel: string;
    marketingProductName: string;
    chargeAmount?: number;
    vatAmount?: number;
    price?: number;
    quantity: number;
    totalPrice: number;
};
