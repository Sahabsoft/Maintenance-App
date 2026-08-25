 export interface CustomerVisitRequest {
  visitNumber: string;
  customerName: string;
  phone: string;
  address?: string | null;
  notes?: Text | null;
  visitType: number;
  state?: number;
  userId?: string | null;
}