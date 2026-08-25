import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CustomerVisitRequest } from '../../models/CustomerVisitRequest';
import { CustomerVisitService } from '../../services/CustomerVisitService';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-booking',
  imports: [FormsModule,RouterLink],
  templateUrl: './booking.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './booking.scss', 
})
export class Booking {
 constructor(private service: CustomerVisitService,    private router: Router) {


 }  id = '';
 error = signal('');
  saving = signal(false);
  submit() {const obs =this.service.create(this.customerVisitRequest);
    obs.subscribe({
       next: (res) => {
        this.saving.set(false);
       this.router.navigate(['/track-request', res.data.id]);
      },
      error: (err: any) => {
        this.saving.set(false);
        this.error.set(err?.message || 'خطأ عند الحفظ');
      },
    });
  }
  customerVisitRequest: CustomerVisitRequest = {
    customerName: '',
    visitNumber: '',
    phone: '',
    address: '',
    visitType: 0,
  };
}

