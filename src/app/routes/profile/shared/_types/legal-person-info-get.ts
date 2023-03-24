import { ILegalUser } from '@shared/.';

export type LegalPersonInfoGet = ILegalUser & {
  representativePersonId?: number;
  mobileContactInfoId?: number;
  emailContactInfoId?: number;
  personAddressInfoId?: number;
  profileImageDocumentInfoId?: string;
  confirmedMobile: boolean;
  confirmedEmail: boolean;
  canRegisterInformation: boolean;
  customerId: number;
}
