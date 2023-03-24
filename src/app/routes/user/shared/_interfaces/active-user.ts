import { UserType, PersonType } from '..';

export interface IActiveUser {
  id: string;
  fullName: string;
  userType: UserType;
  personType: PersonType;
  isActive: boolean;
  personId: number;
  confirmedMobile: boolean;
  confirmedEmail: boolean;
  selfRegister: boolean;
  isRetailSeller: boolean;
  saleStructureUserId: number;
  roleTitle: string;
  users: IActiveUser[];
  userId: string;
}
