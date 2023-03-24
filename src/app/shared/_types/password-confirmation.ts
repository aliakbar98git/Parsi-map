import { IUserAccount } from '../../routes/user/shared';

export type PasswordConfirmation = Omit<IUserAccount, "username">
