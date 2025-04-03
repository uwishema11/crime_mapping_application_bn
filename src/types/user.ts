export type Role = "ADMIN" | "USER" | "SUPERADMIN";

export type Status = "ACTIVE" | "DISACTIVE";
export type verifiedUser = "VERIFIED" | "FALSE";

export interface userType {
  id: number;
  email: string;
  role: Role;
  password: string;
  confirm_password?: string;
  firstName: string;
  lastName: string;
  isVerified: verifiedUser;
  status: Status;
  phone_number: string;
  created_at: Date;
  updated_at: Date;
}

export interface tokenData {
  id: number;
  email: string;
  role: string;
}
