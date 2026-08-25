import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { MaintenanceOrderService } from '../../services/MaintenanceOrderService';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-edit-order',
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './edit-order.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './edit-order.scss',
})
export class EditOrder {
  id = '';
  loading = signal(true);
  saving = signal(false);
  error = signal('');

  customerId = '';
  deviceType = '';
  brand = '';
  model = '';
  serialNumber = '';
  problemDescription = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MaintenanceOrderService,
 private notification: NotificationService, ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (!this.id) {
      this.router.navigate(['/orders']);
      return;
    }

    this.loading.set(true);
    this.service.getById(this.id).subscribe({
      next: (res) => {
        this.customerId = res.customerId || '';
        this.deviceType = res.deviceType || '';
        this.brand = res.brand || '';
        this.model = res.model || '';
        this.serialNumber = res.serialNumber || '';
        this.problemDescription = res.problemDescription || '';
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message || 'خطأ في تحميل الطلب');
        this.loading.set(false);
      },
    });
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

    if (this.customerId) payload.customerId = this.customerId;

    this.service.update(this.id, payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.notification.success();
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.message || 'خطأ أثناء تحديث الطلب');
      },
    });
  }
}
