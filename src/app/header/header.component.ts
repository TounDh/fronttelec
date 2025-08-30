import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  providers: [
      AuthService,
      HttpClient
    ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false;
  currentUser: any = null;

  constructor(
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    // Check initial authentication status
    this.isAuthenticated = this.authService.isLoggedIn();
    this.currentUser = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.currentUser = null;
    this.router.navigate(['/home']);
  }

  // Helper method to check if user has admin role
  isAdmin(): boolean {
    const userRole = this.authService.getUserRole();
    return userRole === 'admin' || userRole === 'ROLE_ADMIN';
  }
}