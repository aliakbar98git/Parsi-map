import { ImageType } from '@shared/_enums/imageType.enum';

export type FavoriteProductGet = {
  favoriteId: string;
  description: string;
  isActive: boolean;
  marketingProductId: string;
  marketingProductModel: string;
  marketingProductName: string;
  defaultDocumentInfoId: string;
  priceByDiscount: number;
  imageType: ImageType;
}
