import { AddressType } from '..';

export interface IAddress {
  personAddressInfoId?: number;
  addressType: AddressType;
  postalCode: string;
  cityId?: string;
  parishId?: string;
  contactNumber: string;
  address: string;
  isDefault: boolean;
  personId?: number;
  Longitude?: number;
  Latitude?: number;
  additionalAddressInfo: string;
  unitNumber: string;
  houseNumber: number;
  hasElevator: boolean;
  floorNumber: number;
  needCheckOfficeAddress: boolean;
  isLegal: boolean;
  isRegister: boolean;
  userRole:string;
}