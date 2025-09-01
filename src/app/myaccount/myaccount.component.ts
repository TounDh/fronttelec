import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { catchError, of, throwError } from 'rxjs';

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

  paymentForm: FormGroup;
  isProcessingPayment: boolean = false;


  userInstallations: any[] = [];
  nextInstallation: any = null;
  previousInstallations: any[] = [];
  isLoadingInstallations: boolean = false;
  countdownInterval: any = null;


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
    // Initialize payment form
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/), this.validateExpiryDate.bind(this)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
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
    } else if (section === 'installations') {
      this.loadUserInstallations();
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
    
    // For installation dates, use a simpler format
    if (this.activeSection === 'installations') {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
    }
  return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });}

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






  processPayment() {
  if (this.paymentForm.valid && this.recentPayment) {
    this.isProcessingPayment = true;
    
    // Send the expiry date in MM/YY format (don't convert to MM-YY)
    const paymentData = {
      cardNumber: this.paymentForm.value.cardNumber.replace(/\s/g, ''), // Remove spaces
      expiryDate: this.paymentForm.value.expiryDate, // Keep as MM/YY
      cvv: this.paymentForm.value.cvv
    };

    console.log('Sending payment data:', paymentData); // Debug log

    this.http.post<any>(`http://localhost:8085/api/payments/${this.recentPayment.id}/process`, paymentData)
      .pipe(
        catchError(error => {
          console.error('Error processing payment:', error);
          this.isProcessingPayment = false;
          alert(error.error?.error || 'Failed to process payment. Please try again.');
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (response) => {
          this.isProcessingPayment = false;
          alert(response.message || 'Payment processed successfully!');
          // Refresh payments
          this.loadUserPayments();
          // Close modal
          this.closePaymentModal();
          this.paymentForm.reset();
        }
      });
  }
}

// Add this method to close the modal properly
closePaymentModal() {
  const modal = document.getElementById('paymentModal');
  if (modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
  }
}



// Add this method to format the expiry date input as user types
formatExpiryDate(event: any) {
  let input = event.target.value.replace(/\D/g, ''); // Remove non-digits
  if (input.length > 4) input = input.substring(0, 4); // Limit to 4 digits
  
  // Format as MM/YY
  if (input.length > 2) {
    input = input.substring(0, 2) + '/' + input.substring(2);
  }
  
  this.paymentForm.patchValue({
    expiryDate: input
  }, {emitEvent: false});
}

// Add custom validator for expiry date
validateExpiryDate(control: any) {
  const value = control.value;
  if (!value) return null;
  
  // Check format (MM/YY)
  if (!/^\d{2}\/\d{2}$/.test(value)) {
    return { invalidFormat: true };
  }
  
  const [month, year] = value.split('/').map(Number);
  
  // Check if month is valid (1-12)
  if (month < 1 || month > 12) {
    return { invalidMonth: true };
  }
  
  // Check if date is in the future
  const currentYear = new Date().getFullYear() % 100; // Last 2 digits
  const currentMonth = new Date().getMonth() + 1;
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return { expired: true };
  }
  
  return null; // Valid
}







loadUserInstallations() {
    if (this.currentUser && this.currentUser.id) {
      this.isLoadingInstallations = true;
      
      // First get all applications for this user
      this.http.get<any[]>(`http://localhost:8085/api/applications/user/${this.currentUser.id}`)
        .pipe(
          catchError(error => {
            console.error('Error loading applications for installations:', error);
            this.isLoadingInstallations = false;
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
              this.isLoadingInstallations = false;
              this.userInstallations = [];
              this.nextInstallation = null;
              this.previousInstallations = [];
              return;
            }
            
            // Get installations for these applications
            this.http.post<any[]>(`http://localhost:8085/api/installations/by-applications`, approvedApplicationIds)
              .pipe(
                catchError(error => {
                  console.error('Error loading installations:', error);
                  this.isLoadingInstallations = false;
                  return throwError(() => error);
                })
              )
              .subscribe({
                next: (installations) => {
                  this.isLoadingInstallations = false;
                  this.userInstallations = installations || [];
                  
                  // Sort installations by date (newest first)
                  this.userInstallations.sort((a, b) => {
                    return new Date(b.date).getTime() - new Date(a.date).getTime();
                  });
                  
                  // Find next installation (most recent scheduled one)
                  this.nextInstallation = this.userInstallations.find(inst => 
                    inst.status === 'SCHEDULED' && new Date(inst.date) > new Date()
                  );
                  
                  // Find previous installations (all others)
                  this.previousInstallations = this.userInstallations.filter(inst => 
                    inst !== this.nextInstallation
                  );
                  
                  // Start countdown timer if there's a scheduled installation
                  if (this.nextInstallation && this.nextInstallation.status === 'SCHEDULED') {
                    this.startCountdownTimer();
                  }
                }
              });
          }
        });
    }}


    calculateCountdown(installationDate: string): string {
    const now = new Date();
    const targetDate = new Date(installationDate);
    const diff = targetDate.getTime() - now.getTime();
    
    if (diff <= 0) {
      return 'Installation date has passed';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (days > 0) {
      return `${days} days, ${hours} hours left`;
    } else if (hours > 0) {
      return `${hours} hours, ${minutes} minutes left`;
    } else {
      return `${minutes} minutes, ${seconds} seconds left`;
    }
  }

  startCountdownTimer() {
    // Clear any existing interval
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    
    // Update countdown every minute
    this.countdownInterval = setInterval(() => {
      if (this.nextInstallation && this.nextInstallation.date) {
        // This will trigger change detection and update the countdown text
        this.calculateCountdown(this.nextInstallation.date);
      } else {
        clearInterval(this.countdownInterval);
      }
    }, 60000); // Update every minute
  }
  formatInstallationDate(dateString: string): string {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

 
    










    // For other sections, use the detailed format
  





















loadUserAddress() {
  if (this.currentUser && this.currentUser.id) {
    this.isLoadingAddress = true;
    this.http.get<any>(`http://localhost:8085/api/address/user/${this.currentUser.id}`)
      .pipe(
        catchError(error => {
          this.isLoadingAddress = false;
          
          if (error.status === 404) {
            // No address found - this is normal, not an error
            console.log('No address found for user, showing add address form');
            this.userAddress = null;
            return of(null); // Return observable that completes without error
          } else {
            console.error('Error loading address:', error);
            alert('Failed to load address. Please try again.');
            return throwError(() => error);
          }
        })
      )
      .subscribe({
        next: (response) => {
          this.isLoadingAddress = false;
          
          if (response && response.success === true && response.data) {
            this.userAddress = response.data;
          } else if (response && response.success === false) {
            // API returned a "no address found" message
            console.log(response.message);
            this.userAddress = null;
          } else {
            // Handle any other response structure
            this.userAddress = response;
          }
        },
        error: (error) => {
          // This will only be called for non-404 errors
          this.isLoadingAddress = false;
          console.error('Unexpected error loading address:', error);
        }
      });
  }
}

// Add this method to open the add address modal
openAddAddressModal() {
  this.addressForm.reset();
  this.showAddAddressModal = true;
}

// Enhanced saveAddress method
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
        // Handle different response structures
        if (response && response.data) {
          this.userAddress = response.data;
        } else if (response) {
          // Handle raw address response
          this.userAddress = response;
        }
        
        this.showAddAddressModal = false;
        this.showEditAddressModal = false;
        alert('Address saved successfully!');
        
        // Reload the address to ensure we have the latest data
        this.loadUserAddress();
      }
    });
  }
}
}
