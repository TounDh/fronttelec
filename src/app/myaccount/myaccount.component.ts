import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { catchError, throwError } from 'rxjs';

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
  isLoadingApplications: boolean = false;
  editForm: FormGroup;
  addressForm: FormGroup;
  showEditModal: boolean = false;
  showAddAddressModal: boolean = false;
  showEditAddressModal: boolean = false;
  userAddress: any = null;
  userApplications: any[] = [];
  userPayments: any[] = []; // Add this
  recentPayment: any = null;
  isLoadingPayments: boolean = false;


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
    } else if (section === 'applications') {
      this.loadUserApplications();
    } else if (section === 'payments') { // Add this
      this.loadUserPayments();
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

  // Add this method to load user applications
  loadUserApplications() {
  if (this.currentUser && this.currentUser.id) {
    this.isLoadingApplications = true;
    this.http.get<any[]>(`http://localhost:8085/api/applications/user/${this.currentUser.id}`)
      .pipe(
        catchError(error => {
          console.error('Error loading applications:', error);
          this.isLoadingApplications = false;
          alert('Failed to load applications. Please try again.');
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (applications) => {
          this.isLoadingApplications = false;
          console.log('Applications received:', applications); // Debug log
          
          this.userApplications = applications || [];
          
          // Sort applications by date (newest first)
          this.userApplications.sort((a, b) => {
            return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
          });
          
          console.log('Sorted applications:', this.userApplications); // Debug log
        }
      });
  }
}
  

  // Add this method to format dates
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

  // ... rest of your existing methods remain the same
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

  loadUserAddress() {
    if (this.currentUser && this.currentUser.id) {
      this.isLoadingAddress = true;
      this.http.get<any>(`http://localhost:8085/api/address/user/${this.currentUser.id}`)
        .pipe(
          catchError(error => {
            console.error('Error loading address:', error);
            this.isLoadingAddress = false;
            
            if (error.status === 404) {
              // No address found - this is normal
              this.userAddress = null;
            } else {
              alert('Failed to load address. Please try again.');
            }
            return throwError(() => error);
          })
        )
        .subscribe({
          next: (response) => {
            this.isLoadingAddress = false;
            
            // Handle the response structure correctly
            if (response && response.data) {
              this.userAddress = response.data; // Extract from data property
            } else if (response && response.message) {
              // No address found but API returned a message
              console.log(response.message);
              this.userAddress = null;
            } else {
              // Handle raw address response (backward compatibility)
              this.userAddress = response;
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
      )
      .pipe(
        catchError(error => {
          console.error('Error saving address:', error);
          alert('Failed to save address. Please try again.');
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          // Handle response with consistent structure
          if (response && response.data) {
            this.userAddress = response.data; // Extract from data property
            this.showAddAddressModal = false;
            this.showEditAddressModal = false;
            alert('Address saved successfully!');
          } else if (response && response.message) {
            alert('Failed to save address: ' + response.message);
          } else {
            // Handle raw address response (backward compatibility)
            this.userAddress = response;
            this.showAddAddressModal = false;
            this.showEditAddressModal = false;
            alert('Address saved successfully!');
          }
        }
      });
    }
  }







  loadUserPayments() {
    if (this.currentUser && this.currentUser.id) {
      this.isLoadingPayments = true;
      
      // First get all applications for this user
      this.http.get<any[]>(`http://localhost:8085/api/applications/user/${this.currentUser.id}`)
        .pipe(
          catchError(error => {
            console.error('Error loading applications for payments:', error);
            this.isLoadingPayments = false;
            return throwError(() => error);
          })
        )
        .subscribe({
          next: (applications) => {
            // Get all approved application IDs
            const approvedApplicationIds = applications
              .filter(app => app.status === 'APPROVED')
              .map(app => app.id);
            
            if (approvedApplicationIds.length === 0) {
              this.isLoadingPayments = false;
              this.userPayments = [];
              return;
            }
            
            // Get payments for these applications
            this.http.post<any[]>(`http://localhost:8085/api/payments/by-applications`, approvedApplicationIds)
              .pipe(
                catchError(error => {
                  console.error('Error loading payments:', error);
                  this.isLoadingPayments = false;
                  return throwError(() => error);
                })
              )
              .subscribe({
                next: (payments) => {
                  this.isLoadingPayments = false;
                  this.userPayments = payments || [];
                  
                  // Sort payments by deadline (newest first)
                  this.userPayments.sort((a, b) => {
                    return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
                  });
                  
                  // Set recent payment (most recent)
                  this.recentPayment = this.userPayments.length > 0 ? this.userPayments[0] : null;
                }
              });
          }
        });
    }
  }
}