import { ReportStatus } from "@prisma/client";

export interface ReportType {
  id: number;
  userId: number;
  crimeName: string;
  categoryName: string;
  description: string;
  location: string;
  incidentDate: Date;
  evidence?: string;
  contactNumber?: string;
}

export interface ReportResponse extends ReportType {
  id: number;
  status: ReportStatus;
  reportedAt: Date;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  crime?: {
    id: number;
    crimeName: string;
    description: string;
  };
  category?: {
    id: number;
    name: string;
  };
  reporter?: {
    id: number;
    email: string;
    name: string;
  };
}
