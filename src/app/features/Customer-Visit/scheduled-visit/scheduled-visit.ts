 import { ChangeDetectorRef, Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; 
import { finalize } from 'rxjs';
import { CustomerVisit } from '../models/CustomerVisit.model';
import { CustomerVisitFilter, ScheduledCustomerVisitFilter } from '../models/CustomerVisitFilter';
import { CustomerVisitService } from '../services/CustomerVisitService';
import { JwtService } from '../../../shared/services/jwtService';


@Component({
   changeDetection: ChangeDetectionStrategy.Eager,
 selector: 'app-scheduled-visit',
 imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './scheduled-visit.html',
  styleUrl: './scheduled-visit.css',
}) 
 
export class ScheduledVisit {
  customerVisits: CustomerVisit[] = [];

  filter: ScheduledCustomerVisitFilter = {
    page: 1,
    pageSize: 20,
    scheduledUserId:''
  };
  loading = false;
  error = '';
  totalPages = 0;
  totalCount = 0;
  constructor(
    private service: CustomerVisitService,
    private cdr: ChangeDetectorRef,
    private jwtL:JwtService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.filter.scheduledUserId= this. jwtL.decodeToken( localStorage.getItem('auth_token') || '').sub
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
