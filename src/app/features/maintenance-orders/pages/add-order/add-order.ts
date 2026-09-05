import {
  Component,
  signal,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';

import { MaintenanceOrderService } from '../../services/MaintenanceOrderService';
import { CustomerService } from '../../../customers/services/CustomerService';
import { Customer } from '../../../customers/models/customer.model';

import {
  NgOptionTemplateDirective,
  NgSelectComponent
} from '@ng-select/ng-select';

import { CustomerForm } from '../../../customers/pages/customer-form/customer-form';

import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../../core/services/notification.service';

import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-add-order',
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    NgOptionTemplateDirective,
    NgIf,
    NgSelectComponent
  ],
  templateUrl: './add-order.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './add-order.scss',
})
export class AddOrder implements OnInit, OnDestroy {

  customerId = '';

  deviceType = '';
  brand = '';
  model = '';
  serialNumber = '';
  problemDescription = '';
  supplierName = '';

  customers: Customer[] = [];

  loading = signal(true);

  saving = false;
  error = '';

  private destroy$ = new Subject<void>();

  constructor(
    private service: MaintenanceOrderService,
    private router: Router,
    private cs: CustomerService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {

    // تحميل العملاء أول مرة
    this.loadCustomers();

    // تحديث القائمة عند إضافة أو تعديل أو حذف عميل
    this.cs.customerAdded$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => { 
        this.loadCustomers();

      });

  }

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }


  loadCustomers(): void {

    this.loading.set(true);

    this.cs.list().subscribe({

      next: (res: any) => {  
        this.customers =
          Array.isArray(res)
            ? res
            : res.items || res.data || [];

        this.loading.set(false);

      },

      error: () => {

        this.customers = [];
        this.loading.set(false);

      }

    });

  }


  addCustomer(): void {

    const dialogRef = this.dialog.open(CustomerForm, {

      width: '500px',

    });


    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        // اختيار العميل الجديد تلقائياً
        if (result.id) {

          this.customerId = result.id;

        }

        // لا تحتاج loadCustomers هنا
        // CustomerService سيقوم بتحديث القائمة تلقائياً

      }

    });

  }


  submit(): void {

    this.saving = true;
    this.error = '';

    const payload: any = {

      deviceType: this.deviceType,
      brand: this.brand,
      model: this.model,
      serialNumber: this.serialNumber || null,
      problemDescription: this.problemDescription,
      supplierName: this.supplierName || null,

    };


    if (this.customerId) {

      payload.customerId = this.customerId;

    }


    this.service.create(payload).subscribe({

      next: () => {

        this.saving = false;

        this.notification.success();

      },

      error: (err) => {

        this.saving = false;

        this.error =
          err?.message ||
          'خطأ أثناء إنشاء الطلب';

      }

    });

  }

}