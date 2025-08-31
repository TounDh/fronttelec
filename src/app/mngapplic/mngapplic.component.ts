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

  isEligible: boolean = false;
  isTechnicallyFeasible: boolean = false;
  isTechnicallyFeasibleWithConditions: boolean = false;

  userAddress: any = null;
  creditScore: number = 0;
  hasActiveSubscriptions: boolean = false;
  paymentHistory: any = null;
  infrastructureAvailable: boolean = false;
  distanceToNode: number = 0;
  estimatedInstallationTime: string = '';
  analysisNotes: string = '';
  statusHistory: any[] = [];
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
















// Add these methods to your component
viewApplicationDetails(application: any) {
  this.selectedApplication = application;
  this.loadUserAddress(application.user?.id);
  this.calculateEligibility(application);
  this.calculateTechnicalFeasibility(application);
  this.loadStatusHistory(application.id);
}

loadUserAddress(userId: number) {
  if (userId) {
    this.http.get<any>(`http://localhost:8085/api/address/user/${userId}`)
      .subscribe({
        next: (address) => {
          this.userAddress = address;
        },
        error: (error) => {
          console.error('Error loading user address:', error);
          this.userAddress = null;
        }
      });
  }
}

calculateEligibility(application: any) {
  // Simulate credit score calculation (650-850 range)
  this.creditScore = Math.floor(Math.random() * 200) + 650;
  
  // Simulate subscription check
  this.hasActiveSubscriptions = Math.random() > 0.7;
  
  // Simulate payment history
  this.paymentHistory = {
    hasLatePayments: Math.random() > 0.8,
    totalPayments: Math.floor(Math.random() * 50) + 10
  };
  
  // Determine eligibility
  this.isEligible = this.creditScore >= 650 && !this.paymentHistory.hasLatePayments;
}

calculateTechnicalFeasibility(application: any) {
  // Simulate infrastructure check based on address
  this.infrastructureAvailable = Math.random() > 0.3;
  
  // Simulate distance calculation (100-1500 meters)
  this.distanceToNode = Math.floor(Math.random() * 1400) + 100;
  
  // Simulate installation time estimation
  const days = Math.floor(this.distanceToNode / 300) + 1;
  this.estimatedInstallationTime = `${days} business day${days > 1 ? 's' : ''}`;
  
  // Determine technical feasibility
  this.isTechnicallyFeasible = this.infrastructureAvailable && this.distanceToNode <= 500;
  this.isTechnicallyFeasibleWithConditions = this.infrastructureAvailable && this.distanceToNode <= 1000;
}

loadStatusHistory(applicationId: number) {
  // Simulate status history
  this.statusHistory = [
    {
      status: 'PENDING',
      description: 'Application submitted',
      timestamp: this.selectedApplication.applicationDate
    }
  ];
}

getCreditScoreRating(score: number): string {
  if (score >= 750) return 'Excellent';
  if (score >= 700) return 'Good';
  if (score >= 650) return 'Fair';
  return 'Poor';
}

getDistanceRating(distance: number): string {
  if (distance <= 500) return 'Excellent';
  if (distance <= 1000) return 'Acceptable';
  return 'Poor';
}

getTechnicalFeasibilityStatus(): string {
  if (this.isTechnicallyFeasible) return 'FEASIBLE';
  if (this.isTechnicallyFeasibleWithConditions) return 'FEASIBLE WITH CONDITIONS';
  return 'NOT FEASIBLE';
}

getStatusIcon(status: string): string {
  switch (status) {
    case 'PENDING': return 'time';
    case 'APPROVED': return 'check';
    case 'REJECTED': return 'x';
    default: return 'circle';
  }
}

saveAnalysisNotes() {
  // Implement save functionality
  console.log('Analysis notes saved:', this.analysisNotes);
  // You would typically call an API endpoint here
}

generateAutomaticAnalysis() {
  // Generate automatic analysis based on calculated values
  this.analysisNotes = `Automatic Analysis:
- Credit Score: ${this.creditScore} (${this.getCreditScoreRating(this.creditScore)})
- Payment History: ${this.paymentHistory.hasLatePayments ? 'Has late payments' : 'Good history'}
- Infrastructure: ${this.infrastructureAvailable ? 'Available' : 'Not available'}
- Distance to Node: ${this.distanceToNode}m (${this.getDistanceRating(this.distanceToNode)})
- Recommended Action: ${this.getRecommendedAction()}`;
}

getRecommendedAction(): string {
  if (this.isEligible && this.isTechnicallyFeasible) {
    return 'APPROVE - Good candidate for service';
  } else if (this.isEligible && this.isTechnicallyFeasibleWithConditions) {
    return 'APPROVE WITH CONDITIONS - May require additional installation costs';
  } else {
    return 'REJECT - Does not meet eligibility or technical requirements';
  }
}

approveApplication() {
  // Implement approval logic
  this.updateApplicationStatus('APPROVED');
}

rejectApplication() {
  // Implement rejection logic
  this.updateApplicationStatus('REJECTED');
}

updateApplicationStatus(newStatus: string) {
  if (!this.selectedApplication) return;
  
  this.http.put(`http://localhost:8085/api/applications/${this.selectedApplication.id}/status?status=${newStatus}`, {})
    .subscribe({
      next: (updatedApplication) => {
        this.selectedApplication.status = newStatus;
        // Add to status history
        this.statusHistory.push({
          status: newStatus,
          description: `Application ${newStatus.toLowerCase()}`,
          timestamp: new Date()
        });

         this.closeModal('viewRequestModal');

        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
      },
      error: (error) => {
        console.error('Error updating application status:', error);
      }
    });
}



private closeModal(modalId: string) {
  const modal = document.getElementById(modalId);
  if (modal) {
    // Use Bootstrap's modal hide method if available
    const bootstrapModal = (window as any).bootstrap?.Modal?.getInstance(modal);
    if (bootstrapModal) {
      bootstrapModal.hide();
    } else {
      // Fallback: manually hide the modal
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }
    }
  }
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