import { IRealUser } from '@shared/.';

export type RealPersonInfoUpdate = IRealUser & {
  mobileContactInfoId?: number;
  emailContactInfoId?: number;
}
