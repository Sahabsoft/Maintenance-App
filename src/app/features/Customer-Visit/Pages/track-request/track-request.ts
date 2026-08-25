import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerVisitService } from '../../services/CustomerVisitService';
import { CustomerVisit } from '../../models/CustomerVisit.model';

@Component({
  selector: 'app-track-request',
  imports: [CommonModule,RouterLink],
  templateUrl: './track-request.html',
  styleUrl: './track-request.css',
})
export class TrackRequest { 
constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef,private service: CustomerVisitService) {}
  visit: CustomerVisit   = {address: '',scheduledUserId:'', createdAt: new Date(),scheduledDate:null, customerName: '', customerVisitStateLogs: [], id: '', notes: '', phone: '', state: 0, visitNumber: '', visitType: 0};
 
  ngOnInit() {
 const id = this.route.snapshot.paramMap.get('id');
      if(id){
    this.service.getById(id).subscribe(res=>{

     this.visit = res;
      this.cdr.detectChanges();
    });

  }}

  get progress(): number {

    switch (this.visit?.state) {

      case 1:
        return 25;

      case 2:
        return 50;

      case 3:
        return 75;

      case 4:
        return 100;

      default:
        return 0;

    }

  }

}