import { PasswordConfirmation } from '@shared/.';

export type PasswordUpdate = PasswordConfirmation & {
  currentPassword: string;
}
