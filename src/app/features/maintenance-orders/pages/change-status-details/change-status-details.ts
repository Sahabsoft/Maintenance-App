import { ChangeDetectorRef, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaintenanceStatus } from '../../models/maintenance-status.enum';
import { MaintenanceOrderService } from '../../services/MaintenanceOrderService';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf ,Location} from '@angular/common';
import { MaintenanceLogResponse } from '../../../../core/models/MaintenanceLogResponse';
import { environment } from  '../../../../../environments/environment';
2
@Component({
  selector: 'app-change-status-details',
   imports: [FormsModule, NgIf, NgFor],
 templateUrl: './change-status-details.html',
  styleUrl: './change-status-details.scss',
})
export class ChangeStatusDetails implements OnDestroy, OnInit {
   

  

  loading = signal(false);
  saving = signal(false);
  error = signal('');

  files: File[] = [];

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

   images: {id:string;  url: string;  name: string;  isNew: boolean;}[] = [];
  log: MaintenanceLogResponse  ; 
  constructor( private location: Location,   private route: ActivatedRoute,private cdr: ChangeDetectorRef ,   private router: Router,    private service: MaintenanceOrderService,  ) 
  { 
     const navigation = this.router.getCurrentNavigation();

  this.log = navigation?.extras?.state?.['orderData'];
  }
ngOnInit(): void {
 

this.images = this.log?.files?.map(file => ({
  id: file.id,
  url: `${environment.fileUrl}/${file.filePath}`,
  name: file.fileName,
  isNew: false
})) || [];
``
  
this.cdr.detectChanges(); 
}
 
onFilesSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (!input.files?.length) {
    return;
  }

  const selectedFiles = Array.from(input.files);

  this.files.push(...selectedFiles);

  selectedFiles.forEach(file => {
    this.images.push({
      id: '',
      url: URL.createObjectURL(file),
      name: file.name,
      isNew: true
    });
  });

  input.value = '';
}
  // removeFile(index: number): void {

  //   this.files = this.files.filter(
  //     (_, i) => i !== index
  //   );
  // }

 
  
removePreview(index: number): void {
  const file = this.images[index];
  if (file.isNew) {
    this.files = this.files.filter((_, i) => i !== index);
    URL.revokeObjectURL(file.url);
    this.images.splice(index, 1);
    this.cdr.detectChanges();
    return;
  }
 this.service.removeFile(file.id).subscribe({
    next: () => {
        if (file.url.startsWith('blob:')) URL.revokeObjectURL(file.url);
  
      this.images.splice(index, 1);
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.error.set(
        err?.error?.message ||
        err?.message ||
        'خطأ أثناء إزالة الملف'
      );
    },
  });


}

  submit(): void {

    if (this.saving()) {
      return;
    }

    if (this.log.newStatus === null) {

      this.error.set('اختر الحالة الجديدة');

      return;
    }

    if (this.log.oldStatus === this.log.newStatus && !this.log.notes?.trim() && this.files.length === 0) {

      this.error.set(
        'لم يتم إجراء أي تغيير'
      );

      return;
    }

    this.saving.set(true);
    this.error.set('');

    this.service.updatestatus(      this.log.id,      this.log.newStatus,      this.log.notes,      this.files    ).subscribe({

      next: () => {

        this.saving.set(true);

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

    this.location.back();
  }
ngOnDestroy(): void {
  this.images.forEach(image => {
    if (image.url.startsWith('blob:')) {
      URL.revokeObjectURL(image.url);
    }
  });
}
}