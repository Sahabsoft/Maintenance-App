export interface MaintenanceOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  deviceType: string;
  brand: string;
  model: string;
  problemDescription: string;
  status: number;
  receivedDate: string;
  deliveredDate?: string;
  repairCost?: number;
}