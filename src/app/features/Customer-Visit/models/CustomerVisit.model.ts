import { CustomerVisitStateLog } from "./CustomerVisitStateLog";

export interface CustomerVisit {
  id: string;
  visitNumber: string;
  customerName: string;
  phone: string;
  address?: string | null;
  notes?: string | null;
  visitType: number;
  state: number;
  customerVisitStateLogs: CustomerVisitStateLog[];
  createdAt: Date;
  scheduledDate: Date| null;
  scheduledUserId:string;
}

