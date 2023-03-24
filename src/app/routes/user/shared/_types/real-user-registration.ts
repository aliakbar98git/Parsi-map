import { IRealUser } from '@shared/.';

export type RealUserRegistration = {
  selfRegister: boolean;
  acceptedPolicy: boolean;
  username?: string;
  password?: string;
  confirmPassword?: string;
  DNTCaptchaText?: string;
  DNTCaptchaToken?: string;
  DNTCaptchaInputText?: string;
} & IRealUser;


