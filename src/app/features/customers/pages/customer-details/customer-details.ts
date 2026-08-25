import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { CustomerService } from '../../services/CustomerService';
import { MaintenanceOrderService } from '../../../maintenance-orders/services/MaintenanceOrderService';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink],
  templateUrl: './customer-details.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './customer-details.scss',
})
export class CustomerDetails {
  id = '';

  // ✅ فصل حالات التحميل لتجنب NG0100
  customerLoading = false;
  ordersLoading = false;

  error = '';

  customer: any = null;
  orders: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cs: CustomerService,
    private os: MaintenanceOrderService,  
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    if (!this.id) {
      this.router.navigate(['/customers']);
      return;
    }

    this.loadCustomer();
  }

  // ========================
  // 1. تحميل العميل
  // ========================

  loadCustomer() {
    this.customerLoading = true;
    this.ordersLoading = false;
    this.error = '';

    this.cs
      .getById(this.id)
      .pipe(
        switchMap((c) => {
          this.customer = c ?? null;
          this.customerLoading = false;

          this.ordersLoading = true;
          return this.os.getOrders({ customerId: this.id, page: 1, pageSize: 100 });
        }),
      )
      .subscribe({
        next: (res: any) => {
          const items = res?.data?.items || res?.data || res?.items || [];
          const customerName = this.customer?.name;

          this.orders = Array.isArray(items)
            ? items.filter(
                (it: any) => it.customerId === this.id || it.customerName === customerName,
              )
            : [];
this.cdr.detectChanges();
          this.ordersLoading = false;
        },
        error: (e) => {
          this.error = e?.message || 'خطأ في التحميل';
          this.customerLoading = false;
          this.ordersLoading = false;
          this.orders = [];
        },
      });
  }

  // ========================
  // 2. تحميل الطلبات
  // ========================
  loadOrders() {
    this.ordersLoading = true;

    this.os.getOrders({ page: 1, pageSize: 100 }).subscribe({
      next: (res: any) => {
        const items = res?.data || res?.data.items || res.items || [];

        const customerName = this.customer?.name;

        this.orders = Array.isArray(items)
          ? items.filter((it: any) => it.customerId === this.id || it.customerName === customerName)
          : [];

        this.ordersLoading = false;
      },
      error: () => {
        this.orders = [];
        this.ordersLoading = false;
      },
    });
  }
}
