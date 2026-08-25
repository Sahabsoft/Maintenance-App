import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { CustomerVisitService } from '../../services/CustomerVisitService';
import { CustomerVisitRequest } from '../../models/CustomerVisitRequest'; 
import { MatDialog } from '@angular/material/dialog'; 
import { ScheduleVisitDialog } from '../../dialogs/schedule-visit-dialog/schedule-visit-dialog';
import { NotificationService } from '../../../../core/services/notification.service';


@Component({
  selector: 'app-customer-visit-form',
  imports: [FormsModule, NgIf, RouterLink],
  templateUrl: './customer-visit-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './customer-visit-form.scss',
})
export class CustomerVisitForm {
  stateDisplay(arg0: number | undefined): string {
    switch (arg0) {
      case 1:
        return 'جديد';
      case 2:
        return 'مجدول';
      case 3:
        return 'قيد التنفيذ';
      case 4:
        return 'مكتمل';
      case 5:
        return 'ملغى';
      default:
        return 'غير معروف';
    }
  }

  id = '';
  loading = signal(true);
  saving = signal(false);
  error = signal('');

  customerVisitRequest: CustomerVisitRequest = {
    customerName: '',
    visitNumber: '',
    phone: '',
    address: '',
    visitType: 0,
  };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: CustomerVisitService,private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.loading.set(true);
      this.service.getById(this.id).subscribe({
        next: (res: any) => {
          // visitNumber
          this.customerVisitRequest.visitNumber = res.visitNumber || '';
          this.customerVisitRequest.customerName = res.customerName || '';
          this.customerVisitRequest.phone = res.phone || '';
          this.customerVisitRequest.address = res.address || '';
          this.customerVisitRequest.notes = res.notes || '';
          this.customerVisitRequest.visitType = res.visitType || 0;
          this.customerVisitRequest.state = res.state || 1;
          this.loading.set(false);
        },
        error: (err: any) => {
          this.error.set(err?.message || 'خطأ في تحميل الزيارة');
          this.loading.set(false);
        },
      });
    } else {
      this.loading.set(false);
    }
  }

  submit() {
    this.saving.set(true);
    this.error.set('');
    const obs = this.id
      ? this.service.update(this.id, this.customerVisitRequest)
      : this.service.create(this.customerVisitRequest);
    obs.subscribe({
      next: () => {
        this.saving.set(false);
      this.notification.success();
      },
      error: (err: any) => {
        this.saving.set(false);
        this.error.set(err?.message || 'خطأ عند الحفظ');
      },
    });
  }
  updateState() {
    if (!this.id) {
      this.error.set('لا يمكن تحديث حالة زيارة غير موجودة');
      return;
    }
    this.service.updateState(this.id, { state: 1 }).subscribe({
      next: () => {
        this.router.navigate(['/ad/customerVisits']);
      },
      error: (err: any) => {
        this.error.set(err?.message || 'خطأ عند تحديث الحالة');
      },
    });
  }
  stateStart() {
    if (!this.id) {
      this.error.set('لا يمكن بدء زيارة غير موجودة');
      return;
    }
    this.service.start(this.id).subscribe({
      next: () => {
        this.router.navigate(['/ad/customerVisits']);
      },
      error: (err: any) => {
        this.error.set(err?.message || 'خطأ عند بدء الزيارة');
      },
    });
  }
  stateComplete() {
    if (!this.id) {
      this.error.set('لا يمكن إكمال زيارة غير موجودة');
      return;
    }
    const _actualCost = prompt('يرجى إدخال التكلفة الفعلية:');
    if (!_actualCost || isNaN(parseFloat(_actualCost))) {
      this.error.set('يجب إدخال تكلفة فعلية صحيحة');
      return;
    }
    const _notes = prompt('يرجى إدخال الملاحظات:');
    if (!_notes) {
      this.error.set('يجب إدخال ملاحظات');
      return;
    }
    this.service
      .complete(this.id, { actualCost: parseFloat(_actualCost), notes: _notes, userId: '' })
      .subscribe({
        next: () => {
          this.router.navigate(['/ad/customerVisits']);
        },
        error: (err: any) => {
          this.error.set(err?.message || 'خطأ عند إكمال الزيارة');
        },
      });
  }
  stateCancel() {
    if (!this.id) {
      this.error.set('لا يمكن إلغاء زيارة غير موجودة');
      return;
    }
    const _reason = prompt('يرجى إدخال سبب الإلغاء:');
    if (!_reason) {
      this.error.set('يجب إدخال سبب الإلغاء');
      return;
    }
    this.service.cancel(this.id, { reason: _reason, userId: '' }).subscribe({
      next: () => {
        this.router.navigate(['/ad/customerVisits']);
      },
      error: (err: any) => {
        this.error.set(err?.message || 'خطأ عند إلغاء الزيارة');
      },
    });
  }

stateSchedule  (){
 if (!this.id) {
      this.error.set('لا يمكن جدولة زيارة غير موجودة');
      return;
    }
    const dialogRef = this.dialog.open(ScheduleVisitDialog ,{
        width:'500px',
        data:{
            visitId:this.id
        }
    });

    dialogRef.afterClosed().subscribe(result=>{

        if(result){
            this.ngOnInit();
            this.notification.success();
        }

    });}

}
