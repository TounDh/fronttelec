// In mngpayment.component.ts - Remove paidDate references
import { Component, AfterViewInit, OnDestroy, Renderer2, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import ApexCharts from 'apexcharts';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mngpayment',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './mngpayment.component.html',
  styleUrls: ['./mngpayment.component.css',
    '../../assets/sneat/vendor/css/core.css',
    '../../assets/sneat/vendor/css/theme-default.css',
    '../../assets/sneat/css/demo.css',
    '../../assets/sneat/vendor/fonts/boxicons.css',
    '../../assets/sneat/vendor/libs/perfect-scrollbar/perfect-scrollbar.css',
    '../../assets/sneat/vendor/libs/apex-charts/apex-charts.css'
  ]
})
export class MngpaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  private scriptElements: HTMLScriptElement[] = [];
  payments: any[] = [];
  filteredPayments: any[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';
  statusFilter: string = '';
  dateFilter: string = '';
  selectedPayment: any = null;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:8085/api/payments/all')
      .subscribe({
        next: (data) => {
          this.payments = data;
          this.filteredPayments = [...this.payments];
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading payments:', error);
          this.isLoading = false;
        }
      });
  }

  searchPayments() {
    const params: any = {};
    if (this.searchTerm) params.search = this.searchTerm;
    if (this.statusFilter) params.status = this.statusFilter;
    if (this.dateFilter) params.date = this.dateFilter;

    this.http.get<any[]>('http://localhost:8085/api/payments/search', { params })
      .subscribe({
        next: (data) => {
          this.filteredPayments = data;
        },
        error: (error) => {
          console.error('Error searching payments:', error);
        }
      });
  }

  updatePaymentStatus(paymentId: number, status: string) {
    this.http.patch<any>(`http://localhost:8085/api/payments/${paymentId}/status`, { status })
      .subscribe({
        next: (data) => {
          // Update local payment data
          const index = this.payments.findIndex(p => p.id === paymentId);
          if (index !== -1) {
            this.payments[index] = data;
            this.filteredPayments = [...this.payments];
          }
        },
        error: (error) => {
          console.error('Error updating payment status:', error);
        }
      });
  }

  selectPayment(payment: any) {
    this.selectedPayment = payment;
  }

  getUserFullName(payment: any): string {
    if (payment.application && payment.application.user) {
      return `${payment.application.user.name || ''} ${payment.application.user.surname || ''}`.trim();
    }
    return 'N/A';
  }

  getServiceName(payment: any): string {
    return payment.application?.srvce?.name || 'N/A';
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PAID': return 'bg-label-success';
      case 'PENDING': return 'bg-label-warning';
      case 'OVERDUE': return 'bg-label-danger';
      default: return 'bg-label-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PAID': return 'Paid';
      case 'PENDING': return 'Pending';
      case 'OVERDUE': return 'Overdue';
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

  ngAfterViewInit() {
    // Your existing chart initialization code
  }

  ngOnDestroy() {
    // Remove scripts to prevent conflicts
    this.scriptElements.forEach(element => this.renderer.removeChild(this.document.body, element));
  }
}