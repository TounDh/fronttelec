import { Component, AfterViewInit, OnDestroy, Renderer2, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import ApexCharts from 'apexcharts';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mnginstalla',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  
  encapsulation: ViewEncapsulation.None,
  templateUrl: './mnginstalla.component.html',
  styleUrls: [
    './mnginstalla.component.css',
    '../../assets/sneat/vendor/css/core.css',
    '../../assets/sneat/vendor/css/theme-default.css',
    '../../assets/sneat/css/demo.css',
    '../../assets/sneat/vendor/fonts/boxicons.css',
    '../../assets/sneat/vendor/libs/perfect-scrollbar/perfect-scrollbar.css',
    '../../assets/sneat/vendor/libs/apex-charts/apex-charts.css'
  ]
})
export class mnginstallaComponent implements OnInit, AfterViewInit, OnDestroy {
  private scriptElements: HTMLScriptElement[] = [];
  installations: any[] = [];
  unscheduledInstallations: any[] = [];
  filteredInstallations: any[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';
  statusFilter: string = '';
  dateFilter: string = '';
  selectedInstallation: any = null;
  scheduleDate: string = '';

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadInstallations();
  }

  loadInstallations() {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:8085/api/installations', {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).subscribe({
      next: (data) => {
        this.installations = data;
        this.filteredInstallations = [...this.installations];
        this.unscheduledInstallations = this.installations.filter(inst => 
          !inst.date || inst.status === 'UNSCHEDULED'
        );
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading installations:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          errorDetails: error.error
        });
        this.isLoading = false;
        alert('Failed to load installations. Please check if the backend server is running at http://localhost:8085.');
      }
    });
  }

  searchInstallations() {
    if (!this.searchTerm && !this.statusFilter && !this.dateFilter) {
      this.filteredInstallations = [...this.installations];
      return;
    }
    
    this.filteredInstallations = this.installations.filter(installation => {
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase();
        const clientName = this.getUserFullName(installation).toLowerCase();
        const serviceName = this.getServiceName(installation).toLowerCase();
        if (!clientName.includes(searchLower) && !serviceName.includes(searchLower)) {
          return false;
        }
      }
      
      if (this.statusFilter && installation.status !== this.statusFilter) {
        return false;
      }
      
      if (this.dateFilter) {
        const installationDate = installation.date ? new Date(installation.date).toISOString().split('T')[0] : '';
        if (installationDate !== this.dateFilter) {
          return false;
        }
      }
      
      return true;
    });
  }

  scheduleInstallation(installationId: number) {
    if (!this.scheduleDate) {
        alert('Please select a valid date.');
        return;
    }

    // Format date to YYYY-MM-DD
    const formattedDate = new Date(this.scheduleDate).toISOString().split('T')[0];
    
    this.http.patch<any>(
        `http://localhost:8085/api/installations/${installationId}/schedule`, 
        { date: formattedDate, status: "SCHEDULED" },
        { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).subscribe({
        next: (data) => {
            // Update the local installation object immediately
            const index = this.installations.findIndex(inst => inst.id === installationId);
            if (index !== -1) {
                this.installations[index].status = "SCHEDULED";
                this.installations[index].date = formattedDate;
                this.filteredInstallations = [...this.installations];
                this.unscheduledInstallations = this.installations.filter(inst => 
                    !inst.date || inst.status === 'UNSCHEDULED'
                );
            }
            
            this.closeModal('scheduleInstallationModal');
            alert('Installation scheduled successfully!');
        },
        error: (error: HttpErrorResponse) => {
            console.error('Error scheduling installation:', error);
            alert('Failed to schedule installation. Please try again.');
        }
    });
}






  

  selectInstallation(installation: any) {
    this.selectedInstallation = installation;
    this.scheduleDate = installation.date ? new Date(installation.date).toISOString().split('T')[0] : '';
  }

  getUserFullName(installation: any): string {
    if (installation.application && installation.application.user) {
      return `${installation.application.user.name || ''} ${installation.application.user.surname || ''}`.trim();
    }
    return 'N/A';
  }

  getServiceName(installation: any): string {
    return installation.application?.srvce?.name || 'N/A';
  }

  getApplicationDate(installation: any): string {
    if (installation.application && installation.application.applicationDate) {
      return this.formatDate(installation.application.applicationDate);
    }
    return 'N/A';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'bg-label-success';
      case 'SCHEDULED': return 'bg-label-info';
      case 'PENDING': return 'bg-label-warning';
      case 'UNSCHEDULED': return 'bg-label-secondary';
      case 'CANCELLED': return 'bg-label-danger';
      default: return 'bg-label-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'Completed';
      case 'SCHEDULED': return 'Scheduled';
      case 'PENDING': return 'Pending';
      case 'UNSCHEDULED': return 'Unscheduled';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  closeModal(modalId: string) {
    const modalElement = this.document.getElementById(modalId);
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement) || 
                    new (window as any).bootstrap.Modal(modalElement);
      modal.hide();
    }
    const backdrop = this.document.querySelector('.modal-backdrop');
    if (backdrop) {
      this.renderer.removeChild(this.document.body, backdrop);
    }
    this.renderer.removeClass(this.document.body, 'modal-open');
  }

  ngAfterViewInit() {
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

    const totalRevenueOptions = {
      chart: { type: 'line', height: 350 },
      series: [{ name: 'Revenue', data: [10, 41, 35, 51, 49, 62, 69, 91, 148] }],
      xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'] },
      colors: ['#2124B1']
    };
    const totalRevenueChart = new ApexCharts(document.querySelector('#totalRevenueChart'), totalRevenueOptions);
    totalRevenueChart.render();

    const growthChartOptions = {
      chart: { type: 'bar', height: 200 },
      series: [{ name: 'Growth', data: [32.5, 41.2] }],
      xaxis: { categories: ['2022', '2021'] },
      colors: ['#4777F5']
    };
    const growthChart = new ApexCharts(document.querySelector('#growthChart'), growthChartOptions);
    growthChart.render();
  }

  ngOnDestroy() {
    this.scriptElements.forEach(element => this.renderer.removeChild(this.document.body, element));
  }
}