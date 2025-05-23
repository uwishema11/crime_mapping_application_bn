// export type Role = "ADMIN" | "USER" | "SUPERADMIN";

// export type Status = "ACTIVE" | "DISACTIVE";
// export type verifiedUser = "VERIFIED" | "FALSE";
import { Gender, Role, UserStatus, VerificationStatus } from '@prisma/client';

export interface userType {
  id: number;
  email: string;
  role: Role;
  password: string;
  confirm_password?: string;
  firstName: string;
  lastName: string;
  isVerified: VerificationStatus;
  status: UserStatus;
  image_url?: string;
  phone_number?: string;
  date_of_birth?: Date;
  gender?: Gender;
  created_at: Date;
  updated_at: Date;
}

export interface tokenData {
  id: number;
  email: string;
  role: string;
}
