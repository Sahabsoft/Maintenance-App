import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaintenanceStatus } from '../../models/maintenance-status.enum';
import { MaintenanceOrderService } from '../../services/MaintenanceOrderService';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
 
@Component({
  selector: 'app-change-status-details',
   imports: [FormsModule, NgIf, NgFor, RouterLink],
 templateUrl: './change-status-details.html',
  styleUrl: './change-status-details.scss',
})
export class ChangeStatusDetails implements OnInit, OnDestroy {

  id = '';

  loading = signal(true);
  saving = signal(false);
  error = signal('');

  files: File[] = [];

  currentStatus: number | null = null;
  newStatus: number | null = null;

  notes = '';

  getStatusText = (status: MaintenanceStatus) => {
    switch (status) {
      case MaintenanceStatus.Received:
        return 'تم الاستلام';
      case MaintenanceStatus.Checking:
        return 'قيد التحقق';
      case MaintenanceStatus.Repairing:
        return 'قيد الإصلاح';
      case MaintenanceStatus.ReadyForDelivery:
        return 'جاهز للتسليم';
      case MaintenanceStatus.Delivered:
        return 'تم التسليم';
      case MaintenanceStatus.CannotRepair:
        return 'لا يمكن إصلاحه';
      default:
        return '';
    }
  };

  statuses = [
    {
      value: MaintenanceStatus.Received,
      label: this.getStatusText(MaintenanceStatus.Received),
    },
    {
      value: MaintenanceStatus.Checking,
      label: this.getStatusText(MaintenanceStatus.Checking),
    },
    {
      value: MaintenanceStatus.Repairing,
      label: this.getStatusText(MaintenanceStatus.Repairing),
    },
    {
      value: MaintenanceStatus.ReadyForDelivery,
      label: this.getStatusText(MaintenanceStatus.ReadyForDelivery),
    },
    {
      value: MaintenanceStatus.Delivered,
      label: this.getStatusText(MaintenanceStatus.Delivered),
    },
    {
      value: MaintenanceStatus.CannotRepair,
      label: this.getStatusText(MaintenanceStatus.CannotRepair),
    },
  ];

  private previewUrls: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MaintenanceOrderService,
  ) {}

  ngOnInit(): void {

    this.id = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.id) {
      this.router.navigate(['/orders']);
      return;
    }

    this.loadOrder();
  }

  private loadOrder(): void {

    this.loading.set(true);
    this.error.set('');

    this.service.getMaintenanceLogById(this.id).subscribe({

      next: (res) => {

        this.currentStatus = res.status ?? null;
        this.newStatus = this.currentStatus;

        this.loading.set(false);
      },

      error: (err) => {

        this.error.set(
          err?.error?.message ||
          err?.message ||
          'خطأ في تحميل حالة الطلب'
        );

        this.loading.set(false);
      },
    });
  }

  onFilesSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const selectedFiles = Array.from(input.files);

    this.files = [
      ...this.files,
      ...selectedFiles,
    ];

    // السماح باختيار نفس الملف مرة أخرى
    input.value = '';
  }

  removeFile(index: number): void {

    this.files = this.files.filter(
      (_, i) => i !== index
    );
  }

  getPreviewUrl(file: File): string {

    const url = URL.createObjectURL(file);

    this.previewUrls.push(url);

    return url;
  }

  submit(): void {

    if (this.saving()) {
      return;
    }

    if (this.newStatus === null) {

      this.error.set('اختر الحالة الجديدة');

      return;
    }

    if (this.currentStatus === this.newStatus && !this.notes.trim() && this.files.length === 0) {

      this.error.set(
        'لم يتم إجراء أي تغيير'
      );

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

        this.router.navigate([
          '/orders'
        ]);
      },

      error: (err) => {

        this.saving.set(false);

        this.error.set(
          err?.error?.message ||
          err?.message ||
          'خطأ أثناء تغيير الحالة'
        );
      },
    });
  }

  cancel(): void {

    if (this.saving()) {
      return;
    }

    this.router.navigate([
      '/orders'
    ]);
  }

  ngOnDestroy(): void {

    this.previewUrls.forEach(
      url => URL.revokeObjectURL(url)
    );

    this.previewUrls = [];
  }
}