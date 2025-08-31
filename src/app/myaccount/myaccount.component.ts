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
  providers: [AuthService, HttpClient],
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.css']
})
export class MyaccountComponent implements OnInit {
  activeSection: string = 'details';
  currentUser: any = null;
  isLoading: boolean = true;
  isLoadingAddress: boolean = false;
  editForm: FormGroup;
  addressForm: FormGroup;
  showEditModal: boolean = false;
  showAddAddressModal: boolean = false;
  showEditAddressModal: boolean = false;
  userAddress: any = null;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      birthdate: ['']
    });

    this.addressForm = this.fb.group({
      street: [''],
      city: [''],
      governorate: [''],
      country: [''],
      zipCode: [''],
      latitude: [null],
      longitude: [null]
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  setActiveSection(section: string) {
    this.activeSection = section;
    if (section === 'address') {
      this.loadUserAddress();
    }
  }

  loadUserData() {
    const rawData = localStorage.getItem('currentUser');
    console.log('Raw localStorage data:', rawData);

    this.currentUser = this.authService.getCurrentUser();
    this.isLoading = false;

    console.log('Parsed user from AuthService:', this.currentUser);
    console.log('User keys:', this.currentUser ? Object.keys(this.currentUser) : 'No user');

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

  

  openEditAddressModal() {
    if (this.userAddress) {
      this.addressForm.patchValue(this.userAddress);
      this.showEditAddressModal = true;
    }
  }

  closeAddressModal() {
    this.showAddAddressModal = false;
    this.showEditAddressModal = false;
    this.addressForm.reset();
  }

  

  deleteAddress() {
    if (confirm('Are you sure you want to delete your address?')) {
      this.http.delete(`/api/address/${this.userAddress.id}`).subscribe({
        next: () => {
          this.userAddress = null;
          alert('Address deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting address:', error);
          alert('Failed to delete address. Please try again.');
        }
      });
    }
  }

  saveChanges() {
    if (this.editForm.valid) {
      // Prepare updated user data
      const updatedUser = {
        ...this.currentUser,
        ...this.editForm.value
      };

      // Update in backend
      this.authService.updateUser(updatedUser).subscribe({
        next: (response) => {
          // Update local state and localStorage
          this.currentUser = response;
          this.authService.updateCurrentUser(response);
          this.showEditModal = false;
          alert('Your details have been updated successfully!');
        },
        error: (error) => {
          console.error('Error updating user:', error);
          alert('Failed to update details. Please try again.');
        }
      });
    }
  }


  // In myaccount.component.ts
// In myaccount.component.ts
loadUserAddress() {
  if (this.currentUser && this.currentUser.id) {
    this.isLoadingAddress = true;
    this.http.get<any>(`http://localhost:8085/api/address/user/${this.currentUser.id}`).subscribe({
      next: (response) => {
        // Check if response is actually an address object or an error message
        if (response && response.id) { // Assuming address has an id property
          this.userAddress = response;
        } else {
          console.log('No address found or error response:', response);
          this.userAddress = null;
        }
        this.isLoadingAddress = false;
      },
      error: (error) => {
        console.error('Error loading address:', error);
        this.userAddress = null;
        this.isLoadingAddress = false;
        
        // Show appropriate message to user
        if (error.status === 404) {
          // No address found - this is normal for new users
          console.log('No address found for user');
        } else {
          alert('Failed to load address. Please try again.');
        }
      }
    });
  }
}

saveAddress() {
  if (this.addressForm.valid && this.currentUser && this.currentUser.id) {
    const addressData = this.addressForm.value;
    
    this.http.post<any>(
      `http://localhost:8085/api/address/user/${this.currentUser.id}`, 
      addressData
    ).subscribe({
      next: (response) => {
        // Check if response is successful
        if (response && response.id) {
          this.userAddress = response;
          this.showAddAddressModal = false;
          this.showEditAddressModal = false;
          alert('Address saved successfully!');
        } else {
          alert('Failed to save address: ' + (response.message || 'Unknown error'));
        }
      },
      error: (error) => {
        console.error('Error saving address:', error);
        alert('Failed to save address. Please try again.');
      }
    });
  }
}
}