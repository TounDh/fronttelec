import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-myaccount',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, ReactiveFormsModule],
  providers: [
    AuthService,
    HttpClient
  ],
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css']
})
export class MyaccountComponent implements OnInit {
  activeSection: string = 'details';
  currentUser: any = null;
  isLoading: boolean = true;
  editForm: FormGroup;
  showEditModal: boolean = false; // Add this variable

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      birthdate: ['']
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  loadUserData() {
    const rawData = localStorage.getItem('currentUser');
    console.log('Raw localStorage data:', rawData);
    
    this.currentUser = this.authService.getCurrentUser();
    this.isLoading = false;
    
    console.log('Parsed user from AuthService:', this.currentUser);
    console.log('User keys:', this.currentUser ? Object.keys(this.currentUser) : 'No user');
    
    // Initialize form with current user data
    if (this.currentUser) {
      this.editForm.patchValue({
        name: this.currentUser.name || '',
        surname: this.currentUser.surname || '',
        email: this.currentUser.email || '',
        phone: this.currentUser.phone || '',
        birthdate: this.currentUser.birthdate || ''
      });
    }
  }

  saveChanges() {
    if (this.editForm.valid) {
      // Update the current user with form values
      this.currentUser = { ...this.currentUser, ...this.editForm.value };
      
      // Update in localStorage
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      
      // Update in AuthService if needed
      if (this.authService.updateCurrentUser) {
        this.authService.updateCurrentUser(this.currentUser);
      }
      
      // Close the modal
      this.showEditModal = false;
      
      // Show success message
      alert('Your details have been updated successfully!');
    }
  }
}