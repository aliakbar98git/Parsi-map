import { IAddress } from '..';

export type AddressGet = IAddress & {
    addressInfoId: number;
    mobileNumber: string;
    provinceId?: string;
    zoneId?: string;
    provinceTitle: string;
    cityTitle: string;
    parishTitle: string;
    zoneTitle: string;
    isActive: boolean;
    typeTitle: string;
};
