export interface CustomerVisitFilter {
  search?: string;
  state?: number;
  visitType?: number;
  fromDate?: string;
  toDate?: string;

  page: number;
  pageSize: number;
}

export interface ScheduledCustomerVisitFilter extends CustomerVisitFilter {
  scheduledUserId?: string; 
}