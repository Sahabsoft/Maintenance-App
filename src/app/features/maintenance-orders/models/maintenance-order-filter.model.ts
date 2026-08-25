export interface MaintenanceOrderFilter {
  search?: string;
  status?: number;
  phone?: string;
  fromDate?: Date;
  toDate?: Date;
  page: number;
  pageSize: number;
  customerId?: string;
}