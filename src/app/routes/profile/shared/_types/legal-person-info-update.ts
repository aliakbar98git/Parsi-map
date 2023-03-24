import { ILegalUser } from '@shared/.';

export type LegalPersonInfoUpdate = ILegalUser & {
  representativePersonId?: number;
  mobileContactInfoId?: number;
  emailContactInfoId?: number;
  personAddressInfoId?: number;
  profileImageDocumentInfoId?: string;
}
