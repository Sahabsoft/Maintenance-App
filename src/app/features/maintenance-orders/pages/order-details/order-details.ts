import { Component, signal, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { MaintenanceOrderService } from '../../services/MaintenanceOrderService';
import { getStatusText } from '../../helpers/maintenance-status.helper';
import { MaintenanceLogResponse } from '../../../../core/models/MaintenanceLogResponse';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, RouterLink, CommonModule],
  templateUrl: './order-details.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './order-details.scss',
})
export class OrderDetails {
  id = '';
  loading = signal(true);
  saving = signal(false);
  error = signal('');

  customerName = '';
  deviceType = '';
  brand = '';
  model = '';
  serialNumber = '';
  problemDescription = '';
  logs: MaintenanceLogResponse[] = [];
  getStatusText = getStatusText;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MaintenanceOrderService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    if (!this.id) {
      this.router.navigate(['/orders']);
      return;
    }

    setTimeout(() => {
      this.loadOrder();
    });
  }

  loadOrder() {
    this.loading.set(true);

    this.service.getById(this.id).subscribe({
      next: (res) => {
        this.customerName = res.customerName || '';
        this.deviceType = res.deviceType || '';
        this.brand = res.brand || '';
        this.model = res.model || '';
        this.serialNumber = res.serialNumber || '';
        this.problemDescription = res.problemDescription || '';
        this.loading.set(false);

        this.loadLogs();
      },
      error: (err) => {
        this.error.set(err?.message || 'خطأ في تحميل الطلب');
        this.loading.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  loadLogs() {
    this.service.getLogs(this.id).subscribe({
      next: (logsRes: MaintenanceLogResponse[]) => {
        this.logs = Array.isArray(logsRes) ? [...logsRes] : [];
        console.log('this.logs', this.logs);
        this.cdr.detectChanges();
      },
      error: () => {
        this.logs = [];
        this.cdr.detectChanges();
      },
    });
  }

  getStatusColor(status: number) {
    switch (status) {
      case 1:
        return { bg: '#dbeafe', color: '#2563eb' };

      case 2:
        return { bg: '#dcfce7', color: '#16a34a' };

      case 3:
        return { bg: '#ffedd5', color: '#ea580c' };

      case 4:
        return { bg: '#f3e8ff', color: '#9333ea' };

      case 5:
        return { bg: '#dcfce7', color: '#15803d' };

      default:
        return { bg: '#f3f4f6', color: '#374151' };
    }
  }
  getStatusClass(status: number): string {
    switch (status) {
      case 1:
        return 'status-new';
      case 2:
        return 'status-check';
      case 3:
        return 'status-repair';
      case 4:
        return 'status-waiting';
      case 5:
        return 'status-ready';
      default:
        return 'status-default';
    }
  }
  submit() {
    this.saving.set(true);
    this.error.set('');

    const payload: any = {
      deviceType: this.deviceType,
      brand: this.brand,
      model: this.model,
      serialNumber: this.serialNumber || null,
      problemDescription: this.problemDescription,
    };

    if (this.customerName) {
      payload.customerName = this.customerName;
    }

    this.service.update(this.id, payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.message || 'خطأ أثناء تحديث الطلب');
        this.cdr.detectChanges();
      },
    });
  }
}
