import { IActiveUser } from '.';

export interface IUserStatus {
  isAuthenticated: boolean;
  user: IActiveUser | null;
}
