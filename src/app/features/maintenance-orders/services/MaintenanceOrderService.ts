import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MaintenanceOrderFilter } from '../models/maintenance-order-filter.model';
import { ApiService } from '../../../core/services/ApiService';
import { MaintenanceLogResponse } from '../../../core/models/MaintenanceLogResponse';
import { JwtService } from '../../../shared/services/jwtService';
import { forkJoin } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MaintenanceOrderService {
  constructor(private api: ApiService ,private jwtL:JwtService) {}

  getOrders(filter: MaintenanceOrderFilter) {
    let params = new HttpParams()
      .set('page', String(filter.page))
      .set('pageSize', String(filter.pageSize));

    if (filter.search) {
      params = params.set('search', filter.search);
    }

    if (filter.status) {
      params = params.set('status', filter.status);
    }

    return this.api.get<any>(
      '/maintenance-orders',
      { params }
    );
  }

  deliver(id: string) {
    return this.api.put(
      `/maintenance-orders/${id}/deliver`,
      {}
    );
  }

  create(order: any) {
    order.UserId = this. jwtL.decodeToken( localStorage.getItem('auth_token') || '').sub;
    return this.api.post<any>('/maintenance-orders', order);
  }

  getById(id: string) {
    return this.api.get<any>(`/maintenance-orders/${id}`).pipe(
      map((resp: any) => resp?.data || resp)
    );
  }
//GetMaintenanceLogById
getMaintenanceLogById(id: string) {
  return this.api.get<any>(`/maintenance-orders/logs/${id}`).pipe(
    map((resp: any) => resp?.data || resp)
  );
}

  update(id: string, payload: any) {
    return this.api.put<any>(`/maintenance-orders/${id}`, payload);
  }

 changeStatus(
  id: string,
  status: number,
  notes: string,
  files: File[]
) {
  const formData = new FormData();

  const token = localStorage.getItem('auth_token');
  const userId = this.jwtL.decodeToken(token || '').sub;

  formData.append('status', String(status));
  formData.append('userId', userId);

  if (notes?.trim()) {
    formData.append('notes', notes.trim());
  }

  files.forEach(file => {
    formData.append('files', file);
  });

  return this.api.put<any>(
    `/maintenance-orders/${id}/status`,
    formData
  );
}
getLogs(id: string) {
  return this.api.get<any>(`/maintenance-orders/${id}/logs`).pipe(
    map((resp: any) => (resp?.data ?? resp ?? []) as MaintenanceLogResponse[])
  );
}
}