import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule, Navbar],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.scss',
  standalone: true,
})
export class App {
    showNavbar = true;
ngOnInit() {
  let route = this.activatedRoute;

  while (route.firstChild) {
    route = route.firstChild;
  }

  this.showNavbar = route.snapshot.data['hideNavbar'] !== true;
}
    
    protected readonly title = signal('maintenance-system');
    constructor(private router: Router,
    private activatedRoute: ActivatedRoute) {
      
     this.router.events
  .pipe(filter(event => event instanceof NavigationEnd))
  .subscribe(() => {

    let route = this.activatedRoute;

    while (route.firstChild) {
      route = route.firstChild;
    }

    

    this.showNavbar = route.snapshot.data['hideNavbar'] !== true;
 
  });
    
    
    }


      
}
