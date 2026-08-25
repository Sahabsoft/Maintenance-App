import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/ApiService';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  constructor(private api: ApiService) {}

  list() {
    return this.api.get<any>('/customers').pipe(map((r:any) => r?.data || r));
  }

  getById(id: string) {
    return this.api.get<any>(`/customers/${id}`).pipe(map((r:any) => r?.data || r));
  }

  create(payload: any) {
    return this.api.post<any>('/customers', payload);
  }

  update(id: string, payload: any) {
    return this.api.put<any>(`/customers/${id}`, payload);
  }

  delete(id: string) {
    return this.api.delete<any>(`/customers/${id}`);
  }
}
