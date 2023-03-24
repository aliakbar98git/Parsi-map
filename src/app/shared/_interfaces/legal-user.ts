export interface ILegalUser {
  title: string;
  nationalId: string;
  registrationCode: string;
  economicCode: string;
  mobileNumber: string;
  email: string;
  postalCode: string;
  cityId: string;
  parishId: string;
  address: string;
  contactNumber: string;
  representativePersonIsForeign: boolean;
  representativePersonNationalCode: string;
  representativePersonForeignerIdentityCode: string;
  representativePersonFirstName: string;
  representativePersonLastName: string;
  vatCertificateDocumentInfoId?: string;
  representativePersonIntroductionDocumentInfoId?: string;
  id?: number;
}
