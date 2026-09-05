import { Injectable, OnDestroy } from '@angular/core';
import { ApiService } from '../../../core/services/ApiService';
import { map, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService implements OnDestroy {

  private customerAddedSource = new Subject<void>();

  customerAdded$ = this.customerAddedSource.asObservable();

  private channel = new BroadcastChannel('customers_channel');

  constructor(private api: ApiService) {

    // استقبال تحديث من Tab آخر
    this.channel.onmessage = (event) => {

      if (event.data === 'CUSTOMERS_UPDATED') {

        this.customerAddedSource.next();

      }

    };

  }


  refreshCustomers(): void {

    // تحديث نفس الـ Tab
    this.customerAddedSource.next();

    // إرسال إشعار لكل الـ Tabs الأخرى
    this.channel.postMessage('CUSTOMERS_UPDATED');

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

        map((r: any) => r?.data || r),

        tap(() => {

          this.refreshCustomers();

        })

      );

  }


  update(id: string, payload: any) {

    return this.api
      .put<any>(`/customers/${id}`, payload)
      .pipe(

        map((r: any) => r?.data || r),

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


  ngOnDestroy(): void {

    this.channel.close();

  }

}