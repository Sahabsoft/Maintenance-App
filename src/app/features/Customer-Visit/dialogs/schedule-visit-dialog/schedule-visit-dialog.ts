import { ChangeDetectorRef, Component ,Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CustomerVisitService } from '../../services/CustomerVisitService'; 
import { FormsModule } from '@angular/forms';
import { ScheduleRequest } from '../../models/StateRequests';
import { MatOption, MatFormField, MatLabel, MatSelectModule } from "@angular/material/select";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { UserService } from '../../../../core/services/UserService';
import { User } from '../../../../core/models/User';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-schedule-visit-dialog',
  imports: [FormsModule, MatOption, MatDialogContent, MatFormField, MatLabel, MatDatepickerModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatDialogActions,NgFor],
  templateUrl: './schedule-visit-dialog.html',
  styleUrl: './schedule-visit-dialog.css',
})
export class ScheduleVisitDialog {
save() {

}

  constructor(
        @Inject(MAT_DIALOG_DATA) public data:any,
        private dialog:MatDialogRef<ScheduleVisitDialog>,
        private service:CustomerVisitService,
        private userService:UserService,
         private cdr: ChangeDetectorRef
    )
{}
 
 id = '';
 technicians: User[] = [];
   loading = signal(true);

   error = signal('');
 scheduleRequest :ScheduleRequest={userId:'',scheduledDate:new Date(),technicianId:''};

  ngOnInit() {
    this.id = this.data.visitId;
   this.userService.list().subscribe({
    next: (res: any) => {
      this.technicians = Array.isArray(res)
        ? res
        : (res.items ?? res.data ?? []);

      this.loading.set(false);

      this.cdr.detectChanges();
    },
    error: () => {
      this.technicians = [];
      this.loading.set(false);

      this.cdr.detectChanges();
    }
  });
  }
    scheduleVisit() {
    if (!this.id) {
      this.error.set('لا يمكن جدولة زيارة غير موجودة');
      return;
    }
     if (!this.scheduleRequest.technicianId) {
      this.error.set('يجب إدخال اسم الفني');
      return;
    }
      if (!this.scheduleRequest.scheduledDate) {
      this.error.set('يجب إدخال تاريخ ووقت الجدولة');
      return;
    } 
    if (isNaN(this.scheduleRequest.scheduledDate.getTime())) {
      this.error.set('يجب إدخال تاريخ ووقت جدولة صحيح');
      return;
    }
    this.service
      .schedule(this.id,  this.scheduleRequest) 
      .subscribe({
        next: () => {
          this.dialog.close(true);
        },
        error: (err: any) => {
          this.error.set(err?.message || 'خطأ عند جدولة الزيارة');
        },
      });
  }
}
