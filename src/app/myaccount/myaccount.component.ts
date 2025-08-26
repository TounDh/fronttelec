import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-myaccount',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './myaccount.component.html',
  styleUrl: './myaccount.component.css'
})
export class MyaccountComponent {
activeSection: string = 'details'; // Default to 'details' section

  setActiveSection(section: string) {
    this.activeSection = section;
  }
}
