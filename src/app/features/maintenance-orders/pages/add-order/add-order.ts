import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaintenanceOrderService } from '../../services/MaintenanceOrderService';
import { CustomerService } from '../../../customers/services/CustomerService';
import { Customer } from '../../../customers/models/customer.model';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { CustomerForm } from '../../../customers/pages/customer-form/customer-form';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-add-order',
  imports: [FormsModule, CommonModule, RouterLink, NgOptionTemplateDirective, NgSelectComponent],
  templateUrl: './add-order.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './add-order.scss',
})
export class AddOrder {
  [x: string]: any;
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

  constructor(
    private service: MaintenanceOrderService,
    private router: Router,
    private cs: CustomerService,private notification: NotificationService,
 private dialog: MatDialog  ) {}

  ngOnInit() {
    
    this.      loadCustomer();
  }
  loadCustomer(){ this.loading.set(true);
    this.cs.list().subscribe({
      next: (res: any) => {
        this.customers = Array.isArray(res) ? res : res.items || res.data || [];
        this.loading.set(false);
      },
      error: () => {
        this.customers = [];
        this.loading.set(false);
      },
    });}
addCustomer(){
   const dialogRef = this.dialog.open(CustomerForm ,{
          width:'500px',
           
      });
  
      dialogRef.afterClosed().subscribe(result=>{
  
          if(result){
       this.      loadCustomer();
          }
  
      });}
  
 
  submit() {
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
        this.notification.success()
      },
      error: (err) => {
        this.saving = false;
        this.error = err?.message || 'خطأ أثناء إنشاء الطلب';
      },
    });
  }
}
