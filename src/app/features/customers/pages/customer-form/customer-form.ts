import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { CustomerService } from '../../services/CustomerService';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-customer-form',
  imports: [FormsModule, NgIf],
  templateUrl: './customer-form.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './customer-form.scss',
})
export class CustomerForm {
  id = '';
  loading = signal(true);
  saving = signal(false);
  error = signal('');

  name = '';
  phone = '';
  address = '';
  notes = '';

constructor(
  private route: ActivatedRoute,
  private router: Router,
  private service: CustomerService,
  private notification: NotificationService,
  private dialogRef: MatDialogRef<CustomerForm>
){}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.loading.set(true);
      this.service.getById(this.id).subscribe({
        next: (res: any) => {
          this.name = res.name || '';
          this.phone = res.phone || '';
          this.address = res.address || '';
          this.notes = res.notes || '';
          this.loading.set(false);
        },
        error: (err: any) => {
          this.error.set(err?.message || 'خطأ في تحميل العميل');
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

  const payload: any = {
    name: this.name,
    phone: this.phone,
    address: this.address || null,
    notes: this.notes || null,
  };

  const obs = this.id
    ? this.service.update(this.id, payload)
    : this.service.create(payload);

  obs.subscribe({

    next: (result: any) => {

      this.saving.set(false);

      this.notification.success();

      // في حالة الإضافة من Dialog
      this.dialogRef.close(result);

    },

    error: (err: any) => {

      this.saving.set(false);

      this.error.set(err?.message || 'خطأ عند الحفظ');

      this.notification.error(
        err?.message || 'خطأ عند الحفظ'
      );

    },

  });

}
}
