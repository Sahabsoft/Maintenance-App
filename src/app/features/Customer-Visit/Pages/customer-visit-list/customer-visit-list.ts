import { ChangeDetectorRef, Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CustomerVisit } from '../../models/CustomerVisit.model';
import { CustomerVisitService } from '../../services/CustomerVisitService';
import { CustomerVisitFilter } from '../../models/CustomerVisitFilter';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-customer-visit-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './customer-visit-list.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './customer-visit-list.scss',
})
export class CustomerVisitList {
  customerVisits: CustomerVisit[] = [];

  filter: CustomerVisitFilter = {
    page: 1,
    pageSize: 20,
  };
  loading = false;
  error = '';
  totalPages = 0;
  totalCount = 0;
  constructor(
    private service: CustomerVisitService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.load();
    });
  }
  load() {
    this.loading = true;

    this.service
      .list(this.filter)

      .subscribe({
        next: (res: any) => {
          const data = res.data;

          this.customerVisits = data?.items ?? [];

          this.filter.page = data?.page ?? 1;
          this.filter.pageSize = data?.pageSize ?? 20;

          this.totalPages = data?.totalPages ?? 0;
          this.totalCount = data?.totalCount ?? 0;
          this.loading = false;
          this.cdr.detectChanges();
        },

        error: (err) => {
          this.error = err.message;
        },
      });
  }
  getStateText(state: number): string {
    switch (state) {
      case 1:
        return 'جديد';
      case 2:
        return 'مجدول';
      case 3:
        return 'قيد التنفيذ';
      case 4:
        return 'تم الانتهاء';
      case 5:
        return 'ملغى';
      default:
        return 'غير معروف';
    }
  }

  getStateClass(state: number): string {
    switch (state) {
      case 1:
        return 'state-new';
      case 2:
        return 'state-scheduled';
      case 3:
        return 'state-progress';
      case 4:
        return 'state-completed';
      case 5:
        return 'state-cancelled';
      default:
        return 'state-default';
    }
  }
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;

    this.filter.page = page;

    this.load();
  }
  search() {
    this.filter.page = 1;

    this.load();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  remove(id: string) {
    if (!confirm('هل تريد حذف هذا العميل؟')) return;
    this.service.delete(id).subscribe(() => this.load());
  }
}
