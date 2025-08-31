import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  services: any[] = [];
  isLoading: boolean = true;
  selectedService: any = null;
  showServiceModal: boolean = false;
  showApplyModal: boolean = false;
  
  applyServiceData: any = {
    serviceId: null,
    offerId: null,
    userId: null
  };

  currentUser: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCurrentUser();
    this.loadServices();
  }

  loadCurrentUser() {
    // Get current user from localStorage or auth service
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.applyServiceData.userId = this.currentUser.id;
    }
  }

  loadServices() {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:8085/api/srvces').subscribe({
      next: (data) => {
        this.services = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        this.isLoading = false;
        // For demo purposes, load sample data if API fails
        this.services = this.getSampleServices();
        this.isLoading = false;
      }
    });
  }

  getServiceIcon(serviceName: string): string {
    if (serviceName.toLowerCase().includes('fiber') || serviceName.toLowerCase().includes('internet')) {
      return 'fa fa-wifi fa-2x';
    } else if (serviceName.toLowerCase().includes('mobile')) {
      return 'fa fa-mobile fa-2x';
    } else if (serviceName.toLowerCase().includes('tv')) {
      return 'fa fa-tv fa-2x';
    }
    return 'fa fa-star fa-2x';
  }

  getAnimationDelay(index: number): string {
    const delays = ['0.1s', '0.3s', '0.6s'];
    return delays[index % delays.length];
  }

  openServiceModal(service: any) {
    this.selectedService = service;
    this.showServiceModal = true;
  }

  closeServiceModal() {
    this.showServiceModal = false;
    this.selectedService = null;
  }

  openApplyModal(service: any) {
    this.selectedService = service;
    this.applyServiceData.serviceId = service.id;
    this.applyServiceData.offerId = null;
    this.showApplyModal = true;
  }

  closeApplyModal() {
    this.showApplyModal = false;
    this.selectedService = null;
    this.applyServiceData = {
      serviceId: null,
      offerId: null,
      userId: this.currentUser?.id || null
    };
  }

  // In your services.component.ts
submitApplication() {
  if (!this.applyServiceData.offerId) {
    alert('Please select an offer');
    return;
  }

  if (!this.applyServiceData.userId) {
    alert('Please log in to apply for a service');
    return;
  }

  // Create application object - no need to set date manually
  const application = {
    user: { id: this.applyServiceData.userId },
    srvce: { id: this.applyServiceData.serviceId },
    offer: { id: this.applyServiceData.offerId },
    status: 'PENDING' // Backend will set this automatically too
    // applicationDate is automatically set by backend
  };

  // Send to backend
  this.http.post('http://localhost:8085/api/applications', application).subscribe({
    next: (response: any) => {
      console.log('Application submitted:', response);
      alert('Application submitted successfully on ' + 
            new Date(response.applicationDate).toLocaleDateString());
      this.closeApplyModal();
    },
    error: (error) => {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  });
}

  // Sample data for demonstration if API is not available
  private getSampleServices(): any[] {
    return [
      {
        id: 1,
        name: 'Fiber Internet 100Mbps',
        description: 'High-speed fiber internet for seamless browsing and streaming.',
        installationFees: 49.99,
        offers: [
          { id: 1, commitment: '12 Months', speed: '50-100 Mbps', price: 34.99 },
          { id: 2, commitment: '24 Months', speed: '50-100 Mbps', price: 29.99 }
        ]
      },
      {
        id: 2,
        name: 'Fiber Internet 500Mbps',
        description: 'Ultra-fast internet for gaming, 4K streaming, and multiple devices.',
        installationFees: 79.99,
        offers: [
          { id: 3, commitment: '12 Months', speed: '200-500 Mbps', price: 59.99 },
          { id: 4, commitment: '24 Months', speed: '200-500 Mbps', price: 49.99 }
        ]
      },
      {
        id: 3,
        name: 'Mobile Unlimited',
        description: 'Unlimited calls, texts, and 4G/5G data for ultimate connectivity.',
        installationFees: 0,
        offers: [
          { id: 5, commitment: '12 Months', speed: '4G/5G (up to 100 Mbps)', price: 39.99 },
          { id: 6, commitment: '24 Months', speed: '4G/5G (up to 100 Mbps)', price: 34.99 }
        ]
      },
      {
        id: 4,
        name: 'Mobile Basic',
        description: 'Affordable plan with essential calls, texts, and 4G data.',
        installationFees: 0,
        offers: [
          { id: 7, commitment: '12 Months', speed: '4G (up to 50 Mbps)', price: 24.99 },
          { id: 8, commitment: '24 Months', speed: '4G (up to 50 Mbps)', price: 19.99 }
        ]
      },
      {
        id: 5,
        name: 'TV Premium',
        description: '200+ channels including sports, movies, and premium content.',
        installationFees: 29.99,
        offers: [
          { id: 9, commitment: '12 Months', speed: '10-50 Mbps', price: 49.99 },
          { id: 10, commitment: '24 Months', speed: '10-50 Mbps', price: 44.99 }
        ]
      },
      {
        id: 6,
        name: 'TV Basic',
        description: 'Access 100+ channels for family entertainment, news, and local programming.',
        installationFees: 19.99,
        offers: [
          { id: 11, commitment: '12 Months', speed: '5-20 Mbps', price: 29.99 },
          { id: 12, commitment: '24 Months', speed: '5-20 Mbps', price: 24.99 }
        ]
      }
    ];
  }
}