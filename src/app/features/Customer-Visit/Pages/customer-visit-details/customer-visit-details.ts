import { ChangeDetectorRef, Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerVisitService } from '../../services/CustomerVisitService';
import { switchMap } from 'rxjs';
import { CustomerVisit } from '../../models/CustomerVisit.model';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, DatePipe } from '@angular/common';

@Component({
  selector: 'app-customer-visit-details',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, DatePipe],
  templateUrl: './customer-visit-details.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './customer-visit-details.scss',
})
export class CustomerVisitDetails {
  updateState() {
    throw new Error('Method not implemented.');
  }

  id = '';

  error = '';
  customerVisitLoading = false;
  customerVisit: CustomerVisit  = {address: '', scheduledUserId:'',createdAt: new Date(),scheduledDate:null, customerName: '', customerVisitStateLogs: [], id: '', notes: '', phone: '', state: 0, visitNumber: '', visitType: 0};
  orders: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cs: CustomerVisitService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    if (!this.id) {
      this.router.navigate(['/CustomerVisits']);
      return;
    }
    this.customerVisitLoading = true;
    this.cs.getById(this.id).subscribe({
      next: (data) => {
        console.log('Customer visit data:', data);
        this.customerVisit = data || null;
        this.orders = data.orders || [];
        this.customerVisitLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching customer visit:', err);
        this.error = 'Failed to load customer visit details.';
        this.customerVisitLoading = false;
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
}
