import { Component, AfterViewInit, OnDestroy, Renderer2, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import ApexCharts from 'apexcharts';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-mngclient',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './mngclient.component.html',
  styleUrls: ['./mngclient.component.css',
    '../../assets/sneat/vendor/css/core.css',
    '../../assets/sneat/vendor/css/theme-default.css',
    '../../assets/sneat/css/demo.css',
    '../../assets/sneat/vendor/fonts/boxicons.css',
    '../../assets/sneat/vendor/libs/perfect-scrollbar/perfect-scrollbar.css',
    '../../assets/sneat/vendor/libs/apex-charts/apex-charts.css'
  ]
})
export class MngclientComponent implements AfterViewInit, OnDestroy, OnInit {
  private scriptElements: HTMLScriptElement[] = [];
  users: any[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';
  selectedUser: any = null;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:8085/api/users')
      .pipe(
        catchError(error => {
          console.error('Error loading users:', error);
          this.isLoading = false;
          alert('Failed to load users. Please try again.');
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (users) => {
          this.users = users;
          this.isLoading = false;
          console.log('Users loaded:', users);
        }
      });
  }

  get filteredUsers() {
    if (!this.searchTerm) {
      return this.users;
    }
    return this.users.filter(user =>
      (user.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.surname?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.phone?.includes(this.searchTerm))
    );
  }

  onSearchChange(event: any) {
    this.searchTerm = event.target.value;
  }

  viewUserDetails(user: any) {
    this.selectedUser = user;
    // Fetch additional details if needed
    this.http.get(`http://localhost:8085/api/users/details?email=${user.email}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching user details:', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (userDetails) => {
          this.selectedUser = userDetails;
        }
      });
  }

  editUser(user: any) {
    this.selectedUser = {...user}; // Create a copy to avoid direct mutation
  }

  archiveUser(user: any) {
    if (confirm(`Are you sure you want to archive ${user.name} ${user.surname}?`)) {
      console.log('Archiving user:', user);
      // Implement archive logic here - you might want to call your backend
      alert('Archive functionality would be implemented here');
    }
  }

  updateUser() {
    if (this.selectedUser) {
      this.http.put(`http://localhost:8085/api/users/${this.selectedUser.id}`, this.selectedUser)
        .pipe(
          catchError(error => {
            console.error('Error updating user:', error);
            alert('Failed to update user. Please try again.');
            return throwError(() => error);
          })
        )
        .subscribe({
          next: (updatedUser) => {
            alert('User updated successfully!');
            this.loadUsers(); // Reload users
            // Close modal
            this.closeModal('editClientModal');
          }
        });
    }
  }

  closeModal(modalId: string) {
    const modal = document.getElementById(modalId);
    if (modal) {
      const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
  }

  ngAfterViewInit() {
    // Load Sneat JS files
    const jsFiles = [
      'assets/sneat/vendor/libs/popper/popper.js',
      'assets/sneat/vendor/js/bootstrap.js',
      'assets/sneat/vendor/libs/perfect-scrollbar/perfect-scrollbar.js',
      'assets/sneat/vendor/js/menu.js',
      'assets/sneat/vendor/libs/apex-charts/apexcharts.js',
      'assets/sneat/js/main.js',
      'assets/sneat/js/dashboards-analytics.js',
      'https://buttons.github.io/buttons.js'
    ];

    jsFiles.forEach(file => {
      const script = this.renderer.createElement('script');
      this.renderer.setAttribute(script, 'src', file);
      this.renderer.appendChild(this.document.body, script);
      this.scriptElements.push(script);
    });

    // Initialize charts (example)
    const totalRevenueOptions = {
      chart: {
        type: 'line',
        height: 350
      },
      series: [{
        name: 'Revenue',
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
      }],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
      },
      colors: ['#2124B1']
    };
    const totalRevenueChart = new ApexCharts(document.querySelector('#totalRevenueChart'), totalRevenueOptions);
    totalRevenueChart.render();

    const growthChartOptions = {
      chart: {
        type: 'bar',
        height: 200
      },
      series: [{
        name: 'Growth',
        data: [32.5, 41.2]
      }],
      xaxis: {
        categories: ['2022', '2021']
      },
      colors: ['#4777F5']
    };
    const growthChart = new ApexCharts(document.querySelector('#growthChart'), growthChartOptions);
    growthChart.render();

    // Add other chart initializations from src/assets/sneat/js/dashboards-analytics.js
  }

  ngOnDestroy() {
    // Remove scripts to prevent conflicts
    this.scriptElements.forEach(element => this.renderer.removeChild(this.document.body, element));
  }
}