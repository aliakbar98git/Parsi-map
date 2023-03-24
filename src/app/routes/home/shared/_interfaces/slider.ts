import { ImageType } from '@shared/.';

export interface ISlider {
  documentInfoId: string;
  link: string;
  description: string;
  imageType: ImageType;
  showingDuration: number;
}
