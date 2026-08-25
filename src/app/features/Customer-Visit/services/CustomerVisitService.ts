import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/ApiService';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { CustomerVisitFilter, ScheduledCustomerVisitFilter }  from '../models/CustomerVisitFilter';
import { CancelRequest, CompleteRequest, ScheduleRequest } from '../models/StateRequests';
import { JwtService } from '../../../shared/services/jwtService';
import { CustomerVisitRequest } from '../models/CustomerVisitRequest';

@Injectable({ providedIn: 'root' })
export class CustomerVisitService {
  updateState(id: string, arg1: { state: number; }) {
    return this.api.put<any>(`/customer-visits/${id}/state`, arg1);    
  }
  constructor(private api: ApiService ,private jwtL:JwtService) {}

 
  
  list(filter: ScheduledCustomerVisitFilter) {

    let params = new HttpParams()
      .set('Page', filter.page)
      .set('PageSize', filter.pageSize);

    if (filter.search)
      params = params.set('Search', filter.search);

    if (filter.state != null)
      params = params.set('State', filter.state);

    if (filter.visitType != null)
      params = params.set('VisitType', filter.visitType);

    if (filter.fromDate)
      params = params.set('FromDate', filter.fromDate);

    if (filter.toDate)
      params = params.set('ToDate', filter.toDate);
    if (filter.scheduledUserId)
      params = params.set('ScheduledUserId', filter.scheduledUserId);

    return this.api.get('/customer-visits', { params });
  }
 
 
  getById(id: string) {
    return this.api.get<any>(`/customer-visits/${id}`).pipe(map((r:any) => r?.data || r));
  }

  create(data: CustomerVisitRequest) {
    const payload: any = { ...data };
    
    payload.userId = localStorage.getItem('userId') || '';
        if(!payload.userId)
          payload.userId = null;
    return this.api.post<any>('/customer-visits', payload);
  }

  update(id: string, payload: any) {
        payload.userId = localStorage.getItem('userId') || '';

    return this.api.put<any>(`/customer-visits/${id}`, payload);
  }

  delete(id: string) {
    return this.api.delete<any>(`/customer-visits/${id}`);
  }
 

  // /api/ad/customer-visits/{publicId}/schedule​
  schedule(id: string, payload: ScheduleRequest ) {
    payload.userId = this.jwtL.decodeToken(localStorage.getItem('auth_token') || '').sub;
    return this.api.put<any>(`/customer-visits/${id}/schedule`, payload);
  }  
  // /api/ad/customer-visits/{publicId}/start​
  start(id: string  ) {
    return this.api.put<any>(`/customer-visits/${id}/start`,{userId: this.jwtL.decodeToken(localStorage.getItem('auth_token') || '').sub});
  }
  // /api/ad/customer-visits/{publicId}/complete
  complete(id: string, payload: CompleteRequest ) {
    payload.userId = this.jwtL.decodeToken(localStorage.getItem('auth_token') || '').sub;
    return this.api.put<any>(`/customer-visits/${id}/complete`, payload);
  }
  // /api/ad/customer-visits/{publicId}/cancel​
  cancel(id: string, payload: CancelRequest) {
    payload.userId = this.jwtL.decodeToken(localStorage.getItem('auth_token') || '').sub;
    return this.api.put<any>(`/customer-visits/${id}/cancel`, payload);
  }
}

function guid(): string | null | undefined {
  throw new Error('Function not implemented.');
}
  