export interface entity {
  displayName?: string;
  goalUserId?:string;
  entityType?: string;
  identityCard?: string;
  personalNumber?: string;
  firstName?: string;
  lastName?: string;
  akaUnit?: string;
  status?: string;
  dischargeDay?: Date;
  rank?: string;
  mail?: string;
  job?: string;
  phone?: string[];
  mobilePhone?: string[];
  address?: string;
  clearance?: string;
  pictures?: {
    profile?: {
      url?: string;
      meta?: any;
    };
  };
  sex?: string;
  birthDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
