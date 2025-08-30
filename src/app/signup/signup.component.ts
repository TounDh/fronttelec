import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClient
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    UserService, // Provide UserService here
    HttpClient // Provide HttpClient here
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService, // Now properly provided
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      surname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{10,15}$/)]],
      birthdate: ['', [Validators.required, this.ageValidator(18)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // ... rest of your component methods remain the same
  passwordMatchValidator(g: AbstractControl) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  ageValidator(minAge: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) return null;
      
      const birthdate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthdate.getFullYear();
      
      const monthDiff = today.getMonth() - birthdate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
        age--;
      }
      
      return age >= minAge ? null : { underage: true };
    };
  }

  get name() { return this.signupForm.get('name'); }
  get surname() { return this.signupForm.get('surname'); }
  get email() { return this.signupForm.get('email'); }
  get phone() { return this.signupForm.get('phone'); }
  get birthdate() { return this.signupForm.get('birthdate'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = { 
        ...this.signupForm.value,
        birthdate: new Date(this.signupForm.value.birthdate).toISOString().split('T')[0]
      };
      
      delete formData.confirmPassword;

      this.userService.signUp(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Registration successful! Redirecting to login...';
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Signup error:', error);
          
          if (error.error && typeof error.error === 'object') {
            let errorMsg = 'Registration failed: ';
            for (const key in error.error) {
              errorMsg += `${error.error[key]}. `;
            }
            this.errorMessage = errorMsg;
          } else if (error.status === 409) {
            this.errorMessage = 'Email already exists. Please use a different email address.';
          } else if (error.status === 0) {
            this.errorMessage = 'Cannot connect to server. Please check if the backend is running.';
          } else {
            this.errorMessage = 'Registration failed. Please try again later.';
          }
        }
      });
    } else {
      Object.keys(this.signupForm.controls).forEach(key => {
        const control = this.signupForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.signupForm.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }

  resetForm() {
    this.signupForm.reset();
    this.errorMessage = '';
    this.successMessage = '';
  }

  getMaxBirthdate(): string {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  }
}