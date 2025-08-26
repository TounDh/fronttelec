import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './../header/header.component';
import { FooterComponent } from './../footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="container-xxl bg-white p-0">
      <app-header *ngIf="!isDashboardRoute"></app-header>
      <router-outlet></router-outlet>
      <app-footer *ngIf="!isDashboardRoute"></app-footer>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angul_telecom';

  constructor(private router: Router) {}

  get isDashboardRoute(): boolean {
    return this.router.url.startsWith('/dash');
  }
}