import { ILegalUser } from '@shared/.';

export type LegalUserRegistration = {
  selfRegister: boolean;
  acceptedPolicy: boolean;
  username?: string;
  password?: string;
  confirmPassword?: string;
  DNTCaptchaText?: string;
  DNTCaptchaToken?: string;
  DNTCaptchaInputText?: string;
} & ILegalUser;
