import { Component, AfterViewInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import ApexCharts from 'apexcharts';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mngservice',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
export class MngserviceComponent implements AfterViewInit, OnDestroy {
  private scriptElements: HTMLScriptElement[] = [];
  private offerCount: number = 0; // To track the number of offer field sets

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private router: Router
  ) {}

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
  }

  ngOnDestroy() {
    // Remove scripts to prevent conflicts
    this.scriptElements.forEach(element => this.renderer.removeChild(this.document.body, element));
  }

  addOfferFields() {
    this.offerCount++;
    const container = this.document.getElementById('offerFieldsContainer');

    // Create a div to hold the offer fields
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

    this.renderer.appendChild(commitmentDiv, commitmentLabel);
    this.renderer.appendChild(commitmentDiv, commitmentInput);

    // Append all fields to the offer div
    this.renderer.appendChild(offerDiv, priceDiv);
    this.renderer.appendChild(offerDiv, speedDiv);
    this.renderer.appendChild(offerDiv, commitmentDiv);

    // Append the offer div to the container
    this.renderer.appendChild(container, offerDiv);
  }
}