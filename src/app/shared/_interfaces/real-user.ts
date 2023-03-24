export interface IRealUser {
  isForeign: boolean;
  nationalCode: string;
  foreignerIdentityCode: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  id?: number;
}
