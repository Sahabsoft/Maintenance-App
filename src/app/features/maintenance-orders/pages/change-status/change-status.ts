import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { MaintenanceOrderService } from '../../services/MaintenanceOrderService';
import { MaintenanceStatus } from '../../models/maintenance-status.enum';
import { getStatusText } from '../../helpers/maintenance-status.helper';

@Component({
  selector: 'app-change-status',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, RouterLink],
  templateUrl: './change-status.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './change-status.scss',
})
export class ChangeStatus {
  id = '';
  loading = signal(true);
  saving = signal(false);
  error = signal('');
files: File[] = [];
  currentStatus = 0;
  newStatus: number | null = null;
  notes = '';

  getStatusText = getStatusText;

  statuses = [
    { value: MaintenanceStatus.Received, label: getStatusText(MaintenanceStatus.Received) },
    { value: MaintenanceStatus.Checking, label: getStatusText(MaintenanceStatus.Checking) },
    { value: MaintenanceStatus.Repairing, label: getStatusText(MaintenanceStatus.Repairing) },
    {
      value: MaintenanceStatus.ReadyForDelivery,
      label: getStatusText(MaintenanceStatus.ReadyForDelivery),
    },
    { value: MaintenanceStatus.Delivered, label: getStatusText(MaintenanceStatus.Delivered) },
    { value: MaintenanceStatus.CannotRepair, label: getStatusText(MaintenanceStatus.CannotRepair) },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MaintenanceOrderService,
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    if (!this.id) {
      this.router.navigate(['/orders']);
      return;
    }

    this.loading.set(true);

    this.service.getById(this.id).subscribe({
      next: (res) => {
        this.currentStatus = res.status || 0;
        this.newStatus = this.currentStatus;
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message || 'خطأ في تحميل حالة الطلب');
        this.loading.set(false);
      },
    });
  }
onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement;

  if (!input.files) {
    return;
  }

  this.files = [
    ...this.files,
    ...Array.from(input.files)
  ];
}removeFile(index: number) {
  this.files = this.files.filter((_, i) => i !== index);
}getPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}
  submit() {
    if (this.newStatus === null) {
      this.error.set('اختر الحالة الجديدة');
      return;
    }

    this.saving.set(true);
    this.error.set('');

   this.service.changeStatus(
  this.id,
  this.newStatus,
  this.notes,
  this.files
).subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.saving.set(false);
        this.error.set(err?.message || 'خطأ أثناء تغيير الحالة');
      },
    });
  }
}
