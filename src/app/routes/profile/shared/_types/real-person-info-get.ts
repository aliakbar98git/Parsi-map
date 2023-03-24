import { IRealUser } from '@shared/.';

export type RealPersonInfoGet = IRealUser & {
  mobileContactInfoId?: number;
  emailContactInfoId?: number;
  confirmedMobile: boolean;
  confirmedEmail: boolean;
}
