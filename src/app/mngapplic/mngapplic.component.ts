import { Component, AfterViewInit, OnDestroy, Renderer2, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-mngapplic',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './mngapplic.component.html',
  styleUrls: [
    '../../assets/sneat/vendor/css/core.css',
    '../../assets/sneat/vendor/css/theme-default.css',
    '../../assets/sneat/css/demo.css',
    '../../assets/sneat/vendor/fonts/boxicons.css',
    '../../assets/sneat/vendor/libs/perfect-scrollbar/perfect-scrollbar.css',
    '../../assets/sneat/vendor/libs/apex-charts/apex-charts.css'
  ]
})
export class MngapplicComponent implements OnInit, AfterViewInit, OnDestroy {
  private scriptElements: HTMLScriptElement[] = [];
  isLoading: boolean = true;
  applications: any[] = [];
  filteredApplications: any[] = [];
  selectedApplication: any = null;
  searchTerm: string = '';
  statusFilter: string = '';
  dateFilter: string = '';
  backendError: boolean = false;

  // Sample data structure that matches your database
  private sampleApplications = [
    {
      id: 1,
      applicationDate: '2025-08-31T11:00:57.000Z',
      status: 'PENDING',
      user_id: 1,
      srvce_id: 9,
      offer_id: 10,
      user: {
        id: 1,
        name: 'testn',
        surname: 'test',
        email: 'test@outlook.com',
        phone: '3378822223'
      },
      srvce: {
        id: 9,
        name: 'Internet Service',
        description: 'High-speed internet connection',
        installationFees: 49.99
      },
      offer: {
        id: 10,
        speed: '100',
        price: 29.99,
        commitment: 12
      }
    },
    {
      id: 2,
      applicationDate: '2025-08-31T11:01:28.000Z',
      status: 'PENDING',
      user_id: 1,
      srvce_id: 3,
      offer_id: 14,
      user: {
        id: 1,
        name: 'testn',
        surname: 'test',
        email: 'test@outlook.com',
        phone: '3378822223'
      },
      srvce: {
        id: 3,
        name: 'TV Package',
        description: 'Premium TV channels',
        installationFees: 29.99
      },
      offer: {
        id: 14,
        speed: 'N/A',
        price: 19.99,
        commitment: 6
      }
    },
    {
      id: 3,
      applicationDate: '2025-08-31T13:05:19.000Z',
      status: 'PENDING',
      user_id: 1,
      srvce_id: 9,
      offer_id: 10,
      user: {
        id: 1,
        name: 'testn',
        surname: 'test',
        email: 'test@outlook.com',
        phone: '3378822223'
      },
      srvce: {
        id: 9,
        name: 'Internet Service',
        description: 'High-speed internet connection',
        installationFees: 49.99
      },
      offer: {
        id: 10,
        speed: '100',
        price: 29.99,
        commitment: 12
      }
    },
    {
      id: 4,
      applicationDate: '2025-08-31T13:06:02.000Z',
      status: 'PENDING',
      user_id: 1,
      srvce_id: 9,
      offer_id: 4,
      user: {
        id: 1,
        name: 'testn',
        surname: 'test',
        email: 'test@outlook.com',
        phone: '3378822223'
      },
      srvce: {
        id: 9,
        name: 'Internet Service',
        description: 'High-speed internet connection',
        installationFees: 49.99
      },
      offer: {
        id: 4,
        speed: '50',
        price: 19.99,
        commitment: 6
      }
    }
  ];

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadApplications();
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
  }

  loadApplications() {
    this.isLoading = true;
    this.backendError = false;
    
    // Try to load from backend - using the correct endpoint for ALL applications
    this.http.get<any[]>('http://localhost:8085/api/applications')
      .pipe(
        catchError(error => {
          console.error('Error loading applications from backend, using sample data:', error);
          this.backendError = true;
          // Use sample data if backend is not available
          return of(this.sampleApplications);
        })
      )
      .subscribe({
        next: (applications) => {
          this.isLoading = false;
          this.applications = applications || [];
          this.filteredApplications = [...this.applications];
          console.log('Applications loaded:', this.applications);
          
          // Show warning if using sample data
          if (this.backendError) {
            console.warn('Using sample data because backend is not available');
          }
        }
      });
  }

  filterApplications() {
    this.filteredApplications = this.applications.filter(app => {
      const matchesSearch = !this.searchTerm || 
        (app.user?.name?.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (app.user?.surname?.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (app.user?.email?.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (app.srvce?.name?.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      const matchesStatus = !this.statusFilter || app.status === this.statusFilter;
      
      const matchesDate = !this.dateFilter || 
        new Date(app.applicationDate).toDateString() === new Date(this.dateFilter).toDateString();
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  }

  viewApplicationDetails(application: any) {
    this.selectedApplication = application;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  retryBackendConnection() {
    this.loadApplications();
  }

  ngOnDestroy() {
    // Remove scripts to prevent conflicts
    this.scriptElements.forEach(element => this.renderer.removeChild(this.document.body, element));
  }
}