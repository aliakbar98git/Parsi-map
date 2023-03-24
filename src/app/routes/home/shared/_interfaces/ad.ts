import { ImageType } from '@shared/.';
import { AdvertisementType } from '..';

export interface IAd {
    documentInfoId: string;
    link: string;
    description: string;
    imageType: ImageType;
    advertisementType: AdvertisementType;
}
