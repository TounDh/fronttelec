import { Component, AfterViewInit, OnDestroy, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';
import ApexCharts from 'apexcharts';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mngclient',
  standalone: true,
  imports: [CommonModule, RouterModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './mngapplic.component.html',
  styleUrls: ['./mngapplic.component.css',
    '../../assets/sneat/vendor/css/core.css',
    '../../assets/sneat/vendor/css/theme-default.css',
    '../../assets/sneat/css/demo.css',
    '../../assets/sneat/vendor/fonts/boxicons.css',
    '../../assets/sneat/vendor/libs/perfect-scrollbar/perfect-scrollbar.css',
    '../../assets/sneat/vendor/libs/apex-charts/apex-charts.css'
  ]
})
export class MngapplicComponent implements AfterViewInit, OnDestroy {
  private scriptElements: HTMLScriptElement[] = [];

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

    // Add other chart initializations from src/assets/sneat/js/dashboards-analytics.js
  }

  ngOnDestroy() {
    // Remove scripts to prevent conflicts
    this.scriptElements.forEach(element => this.renderer.removeChild(this.document.body, element));
  }
}