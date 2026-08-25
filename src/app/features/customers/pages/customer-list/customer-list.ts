import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../services/CustomerService';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './customer-list.html',
})
export class CustomerList {
  customers: Customer[] = [];
  loading = false;
  error = '';

  constructor(private service: CustomerService,  private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.service.list().subscribe({
      next: (res: any) => {
        this.customers = Array.isArray(res) ? res : res.data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err?.message || 'خطأ في جلب العملاء';
        this.loading = false;
      },
    });
  }

  remove(id: string) {
    if (!confirm('هل تريد حذف هذا العميل؟')) return;
    this.service.delete(id).subscribe(() => this.load());
  }
}
