import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/ApiService';
import { map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private customerAddedSource = new Subject<void>();

  customerAdded$ = this.customerAddedSource.asObservable();

  constructor(private api: ApiService) {}

  refreshCustomers(): void {
    this.customerAddedSource.next();
  }

  list() {
    return this.api
      .get<any>('/customers')
      .pipe(
        map((r: any) => r?.data || r)
      );
  }

  getById(id: string) {
    return this.api
      .get<any>(`/customers/${id}`)
      .pipe(
        map((r: any) => r?.data || r)
      );
  }

  create(payload: any) {
    return this.api
      .post<any>('/customers', payload)
      .pipe(
        tap(() => {
          this.refreshCustomers();
        })
      );
  }

  update(id: string, payload: any) {
    return this.api
      .put<any>(`/customers/${id}`, payload)
      .pipe(
        tap(() => {
          this.refreshCustomers();
        })
      );
  }

  delete(id: string) {
    return this.api
      .delete<any>(`/customers/${id}`)
      .pipe(
        tap(() => {
          this.refreshCustomers();
        })
      );
  }
}