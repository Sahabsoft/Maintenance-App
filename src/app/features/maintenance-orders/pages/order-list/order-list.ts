import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';

import { getStatusText } from '../../helpers/maintenance-status.helper';
import { MaintenanceOrderFilter } from '../../models/maintenance-order-filter.model';
import { MaintenanceOrder } from '../../models/maintenance-order.model';
import { MaintenanceOrderService } from '../../services/MaintenanceOrderService';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './order-list.html',
})
export class OrderList implements OnInit {
  orders: MaintenanceOrder[] = [];
  totalCount = 0;

  filter: MaintenanceOrderFilter = {
    page: 1,
    pageSize: 20,
  };

  displayedColumns = ['orderNumber', 'customer', 'device', 'status', 'actions'];

  getStatusText = getStatusText;

  constructor(
    private service: MaintenanceOrderService,
    private cdr: ChangeDetectorRef,
  ) {}

  openReceipt(publicId: string) {
    const url = `${environment.apiUrl}/maintenance-orders/${publicId}/receipt`;
    window.open(url, '_blank');
  }

  openDeliveryReceipt(publicId: string) {
    const url = `${environment.apiUrl}/maintenance-orders/${publicId}/delivery-receipt`;
    window.open(url, '_blank');
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.load();
    });
  }

  load(): void {
    this.service
      .getOrders(this.filter)
      .pipe(map((response: any) => response.data || response))
      .subscribe((response: { items: MaintenanceOrder[]; totalCount: number }) => {
        this.orders = [...(response.items || [])];
        this.totalCount = response.totalCount || 0;
        this.cdr.detectChanges();
      });
  }

  search(): void {
    this.filter.page = 1;
    this.load();
  }

  deliver(id: string): void {
    this.service.deliver(id).subscribe(() => {
      this.load();
    });
  }
}
