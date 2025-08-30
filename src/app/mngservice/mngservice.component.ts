import { Component, AfterViewInit, OnDestroy, Renderer2, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ServiceService } from '../core/services/service.service';
import { Srvce, Offer } from '../core/models/srvce.model';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-mngservice',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  providers: [
    ServiceService, // Provide ServiceService here
    HttpClient // Provide HttpClient here
  ],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './mngservice.component.html',
  styleUrls: [
    './mngservice.component.css',
    '../../assets/sneat/vendor/css/core.css',
    '../../assets/sneat/vendor/css/theme-default.css',
    '../../assets/sneat/css/demo.css',
    '../../assets/sneat/vendor/fonts/boxicons.css',
    '../../assets/sneat/vendor/libs/perfect-scrollbar/perfect-scrollbar.css',
    '../../assets/sneat/vendor/libs/apex-charts/apex-charts.css'
    ]
})
export class MngserviceComponent implements AfterViewInit, OnDestroy, OnInit {
  private scriptElements: HTMLScriptElement[] = [];
  private offerCount: number = 0;
  private editOfferCount: number = 0;

  selectedService: Srvce = { id: null, name: '', description: '', installationFees: 0, offers: [] };
  service: Partial<Srvce> = { name: '', description: '', installationFees: 0, offers: [] }; // Use Partial<Srvce>
  services: Srvce[] = [];

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private serviceService: ServiceService
  ) {}

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

  addOfferFields() {
    this.offerCount++;
    const container = this.document.getElementById('offerFieldsContainer');
    if (!container) {
      console.error('Offer fields container not found');
      return;
    }

    const offerDiv = this.renderer.createElement('div');
    this.renderer.addClass(offerDiv, 'offer-field-set');
    this.renderer.addClass(offerDiv, 'mb-3');

    // Price field
    const priceDiv = this.renderer.createElement('div');
    this.renderer.addClass(priceDiv, 'input-group');
    this.renderer.addClass(priceDiv, 'mb-2');

    const priceLabel = this.renderer.createElement('span');
    this.renderer.addClass(priceLabel, 'input-group-text');
    this.renderer.setProperty(priceLabel, 'innerText', 'Price (TND)');

    const priceInput = this.renderer.createElement('input');
    this.renderer.setAttribute(priceInput, 'type', 'number');
    this.renderer.setAttribute(priceInput, 'step', '0.01');
    this.renderer.addClass(priceInput, 'form-control');
    this.renderer.setAttribute(priceInput, 'placeholder', 'e.g., 29.99');
    this.renderer.setAttribute(priceInput, 'id', `offerPrice_${this.offerCount}`);
    this.renderer.setAttribute(priceInput, 'name', `offerPrice_${this.offerCount}`);
    this.renderer.listen(priceInput, 'input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      this.service.offers = this.service.offers || [];
      this.service.offers[this.offerCount - 1] = {
        ...(this.service.offers[this.offerCount - 1] || {}),
        price: parseFloat(target.value) || 0
      };
    });

    this.renderer.appendChild(priceDiv, priceLabel);
    this.renderer.appendChild(priceDiv, priceInput);

    // Speed field
    const speedDiv = this.renderer.createElement('div');
    this.renderer.addClass(speedDiv, 'input-group');
    this.renderer.addClass(speedDiv, 'mb-2');

    const speedLabel = this.renderer.createElement('span');
    this.renderer.addClass(speedLabel, 'input-group-text');
    this.renderer.setProperty(speedLabel, 'innerText', 'Speed (Mbps)');

    const speedInput = this.renderer.createElement('input');
    this.renderer.setAttribute(speedInput, 'type', 'text');
    this.renderer.addClass(speedInput, 'form-control');
    this.renderer.setAttribute(speedInput, 'placeholder', 'e.g., 10–20');
    this.renderer.setAttribute(speedInput, 'id', `offerSpeed_${this.offerCount}`);
    this.renderer.setAttribute(speedInput, 'name', `offerSpeed_${this.offerCount}`);
    this.renderer.listen(speedInput, 'input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      this.service.offers = this.service.offers || [];
      this.service.offers[this.offerCount - 1] = {
        ...(this.service.offers[this.offerCount - 1] || {}),
        speed: target.value
      };
    });

    this.renderer.appendChild(speedDiv, speedLabel);
    this.renderer.appendChild(speedDiv, speedInput);

    // Commitment field
    const commitmentDiv = this.renderer.createElement('div');
    this.renderer.addClass(commitmentDiv, 'input-group');
    this.renderer.addClass(commitmentDiv, 'mb-2');

    const commitmentLabel = this.renderer.createElement('span');
    this.renderer.addClass(commitmentLabel, 'input-group-text');
    this.renderer.setProperty(commitmentLabel, 'innerText', 'Commitment (Months)');

    const commitmentInput = this.renderer.createElement('input');
    this.renderer.setAttribute(commitmentInput, 'type', 'number');
    this.renderer.addClass(commitmentInput, 'form-control');
    this.renderer.setAttribute(commitmentInput, 'placeholder', 'e.g., 12');
    this.renderer.setAttribute(commitmentInput, 'id', `offerCommitment_${this.offerCount}`);
    this.renderer.setAttribute(commitmentInput, 'name', `offerCommitment_${this.offerCount}`);
    this.renderer.listen(commitmentInput, 'input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      this.service.offers = this.service.offers || [];
      this.service.offers[this.offerCount - 1] = {
        ...(this.service.offers[this.offerCount - 1] || {}),
        commitment: target.value
      };
    });

    this.renderer.appendChild(commitmentDiv, commitmentLabel);
    this.renderer.appendChild(commitmentDiv, commitmentInput);

    this.renderer.appendChild(offerDiv, priceDiv);
    this.renderer.appendChild(offerDiv, speedDiv);
    this.renderer.appendChild(offerDiv, commitmentDiv);
    this.renderer.appendChild(container, offerDiv);

    this.service.offers = this.service.offers || [];
    this.service.offers[this.offerCount - 1] = { price: 0, speed: '', commitment: '' } as Offer;
  }

  
saveService() {
  if (!this.service.name || !this.service.description) {
    alert('Service name and description are required.');
    return;
  }

  // Create service data without id
  const serviceData = {
    name: this.service.name || '',
    description: this.service.description || '',
    installationFees: parseFloat(this.service.installationFees?.toString() || '0') || 0,
    offers: (this.service.offers || []).filter(offer => offer.price && offer.speed && offer.commitment)
  };

  this.serviceService.createService(serviceData).subscribe({
    next: (response) => {
      alert('Service created successfully!');
      this.service = { name: '', description: '', installationFees: 0, offers: [] };
      this.offerCount = 0;
      const container = this.document.getElementById('offerFieldsContainer');
      if (container) {
        container.innerHTML = '';
      }
      const modal = this.document.getElementById('addServiceModal');
      if (modal) {
        const closeButton = modal.querySelector('.btn-close') as HTMLElement;
        if (closeButton) {
          closeButton.click();
        }
      }
    },
    error: (error) => {
      alert('Error creating service: ' + error.message);
    }
  });
}

ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.serviceService.getAllServices().subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (error) => {
        console.error('Error loading services:', error);
        alert('Error loading services: ' + error.message);
      }
    });
  }

  // ... rest of your existing methods (ngAfterViewInit, ngOnDestroy, addOfferFields, saveService) ...

  // Add this method to format offer display
  formatOffer(offer: Offer): string {
    return `${offer.price} TND, ${offer.speed} Mbps, ${offer.commitment}M`;
  }











  //edit
  // New method to open edit modal with service data
  openEditModal(service: Srvce) {
    this.selectedService = { ...service };
    this.editOfferCount = 0;
    
    // Clear existing offer fields
    const container = this.document.getElementById('editOfferFieldsContainer');
    if (container) {
      container.innerHTML = '';
    }
    
    // Add existing offers to the form
    if (this.selectedService.offers && this.selectedService.offers.length > 0) {
      this.selectedService.offers.forEach((offer, index) => {
        this.addEditOfferFields(offer, index);
      });
    }
  }

  // Method to add offer fields in edit modal
  addEditOfferFields(offer?: Offer, index?: number) {
    this.editOfferCount++;
    const container = this.document.getElementById('editOfferFieldsContainer');
    if (!container) {
      console.error('Edit offer fields container not found');
      return;
    }

    const offerDiv = this.renderer.createElement('div');
    this.renderer.addClass(offerDiv, 'offer-field-set');
    this.renderer.addClass(offerDiv, 'mb-3');
    this.renderer.addClass(offerDiv, 'border');
    this.renderer.addClass(offerDiv, 'p-3');
    this.renderer.addClass(offerDiv, 'rounded');

    // Price field
    const priceDiv = this.renderer.createElement('div');
    this.renderer.addClass(priceDiv, 'input-group');
    this.renderer.addClass(priceDiv, 'mb-2');

    const priceLabel = this.renderer.createElement('span');
    this.renderer.addClass(priceLabel, 'input-group-text');
    this.renderer.setProperty(priceLabel, 'innerText', 'Price (TND)');

    const priceInput = this.renderer.createElement('input');
    this.renderer.setAttribute(priceInput, 'type', 'number');
    this.renderer.setAttribute(priceInput, 'step', '0.01');
    this.renderer.addClass(priceInput, 'form-control');
    this.renderer.setAttribute(priceInput, 'placeholder', 'e.g., 29.99');
    this.renderer.setAttribute(priceInput, 'id', `editOfferPrice_${this.editOfferCount}`);
    this.renderer.setAttribute(priceInput, 'name', `editOfferPrice_${this.editOfferCount}`);
    
    // Set value if editing existing offer
    if (offer && index !== undefined) {
      this.renderer.setProperty(priceInput, 'value', offer.price || 0);
    }

    this.renderer.listen(priceInput, 'input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const offerIndex = index !== undefined ? index : this.selectedService.offers.length - 1;
      this.selectedService.offers[offerIndex] = {
        ...(this.selectedService.offers[offerIndex] || {}),
        price: parseFloat(target.value) || 0
      };
    });

    this.renderer.appendChild(priceDiv, priceLabel);
    this.renderer.appendChild(priceDiv, priceInput);

    // Speed field
    const speedDiv = this.renderer.createElement('div');
    this.renderer.addClass(speedDiv, 'input-group');
    this.renderer.addClass(speedDiv, 'mb-2');

    const speedLabel = this.renderer.createElement('span');
    this.renderer.addClass(speedLabel, 'input-group-text');
    this.renderer.setProperty(speedLabel, 'innerText', 'Speed (Mbps)');

    const speedInput = this.renderer.createElement('input');
    this.renderer.setAttribute(speedInput, 'type', 'text');
    this.renderer.addClass(speedInput, 'form-control');
    this.renderer.setAttribute(speedInput, 'placeholder', 'e.g., 10–20');
    this.renderer.setAttribute(speedInput, 'id', `editOfferSpeed_${this.editOfferCount}`);
    this.renderer.setAttribute(speedInput, 'name', `editOfferSpeed_${this.editOfferCount}`);
    
    if (offer && index !== undefined) {
      this.renderer.setProperty(speedInput, 'value', offer.speed || '');
    }

    this.renderer.listen(speedInput, 'input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const offerIndex = index !== undefined ? index : this.selectedService.offers.length - 1;
      this.selectedService.offers[offerIndex] = {
        ...(this.selectedService.offers[offerIndex] || {}),
        speed: target.value
      };
    });

    this.renderer.appendChild(speedDiv, speedLabel);
    this.renderer.appendChild(speedDiv, speedInput);

    // Commitment field
    const commitmentDiv = this.renderer.createElement('div');
    this.renderer.addClass(commitmentDiv, 'input-group');
    this.renderer.addClass(commitmentDiv, 'mb-2');

    const commitmentLabel = this.renderer.createElement('span');
    this.renderer.addClass(commitmentLabel, 'input-group-text');
    this.renderer.setProperty(commitmentLabel, 'innerText', 'Commitment (Months)');

    const commitmentInput = this.renderer.createElement('input');
    this.renderer.setAttribute(commitmentInput, 'type', 'number');
    this.renderer.addClass(commitmentInput, 'form-control');
    this.renderer.setAttribute(commitmentInput, 'placeholder', 'e.g., 12');
    this.renderer.setAttribute(commitmentInput, 'id', `editOfferCommitment_${this.editOfferCount}`);
    this.renderer.setAttribute(commitmentInput, 'name', `editOfferCommitment_${this.editOfferCount}`);
    
    if (offer && index !== undefined) {
      this.renderer.setProperty(commitmentInput, 'value', offer.commitment || '');
    }

    this.renderer.listen(commitmentInput, 'input', (event: Event) => {
      const target = event.target as HTMLInputElement;
      const offerIndex = index !== undefined ? index : this.selectedService.offers.length - 1;
      this.selectedService.offers[offerIndex] = {
        ...(this.selectedService.offers[offerIndex] || {}),
        commitment: target.value
      };
    });

    this.renderer.appendChild(commitmentDiv, commitmentLabel);
    this.renderer.appendChild(commitmentDiv, commitmentInput);

    // Remove button
    const removeButton = this.renderer.createElement('button');
    this.renderer.setProperty(removeButton, 'type', 'button');
    this.renderer.addClass(removeButton, 'btn');
    this.renderer.addClass(removeButton, 'btn-outline-danger');
    this.renderer.addClass(removeButton, 'btn-sm');
    this.renderer.setProperty(removeButton, 'innerText', 'Remove Offer');
    this.renderer.listen(removeButton, 'click', () => {
      if (index !== undefined) {
        this.selectedService.offers.splice(index, 1);
      }
      this.renderer.removeChild(container, offerDiv);
    });

    this.renderer.appendChild(offerDiv, priceDiv);
    this.renderer.appendChild(offerDiv, speedDiv);
    this.renderer.appendChild(offerDiv, commitmentDiv);
    this.renderer.appendChild(offerDiv, removeButton);
    this.renderer.appendChild(container, offerDiv);

    // Add new offer to array if not editing existing one
    if (index === undefined) {
      this.selectedService.offers.push({ price: 0, speed: '', commitment: '' } as Offer);
    }
  }

  // Method to update service
  updateService() {
    if (!this.selectedService.name || !this.selectedService.description) {
      alert('Service name and description are required.');
      return;
    }

    this.serviceService.updateService(this.selectedService.id!, this.selectedService).subscribe({
      next: (response) => {
        alert('Service updated successfully!');
        this.loadServices(); // Reload services to reflect changes
        
        // Close modal
        const modal = this.document.getElementById('editServiceModal');
        if (modal) {
          const closeButton = modal.querySelector('.btn-close') as HTMLElement;
          if (closeButton) {
            closeButton.click();
          }
        }
      },
      error: (error) => {
        alert('Error updating service: ' + error.message);
      }
    });
  }



  //delete
  deleteService(service: Srvce) {
  if (confirm(`Are you sure you want to delete the service "${service.name}"? This will also delete all associated offers.`)) {
    this.serviceService.deleteService(service.id!).subscribe({
      next: () => {
        alert('Service deleted successfully!');
        this.loadServices(); // Reload the services list
      },
      error: (error) => {
        alert('Error deleting service: ' + error.message);
      }
    });
  }
}
}