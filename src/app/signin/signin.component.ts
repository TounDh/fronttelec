import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    AuthService,
    HttpClient
  ],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  signinForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  // Getter methods for easy access to form controls
  get email() { return this.signinForm.get('email'); }
  get password() { return this.signinForm.get('password'); }

  onSubmit() {
    if (this.signinForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.signinForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Store authentication token or user data
          localStorage.setItem('currentUser', JSON.stringify(response));
          localStorage.setItem('authToken', response.token); // If your backend returns a token
          
          // Redirect to home/dashboard
          this.router.navigate(['']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          
          if (error.status === 401) {
            this.errorMessage = 'Invalid email or password';
          } else if (error.status === 0) {
            this.errorMessage = 'Cannot connect to server. Please try again later.';
          } else {
            this.errorMessage = 'Login failed. Please try again.';
          }
        }
      });
    } else {
      // Mark all fields as touched to show validation messages
      Object.keys(this.signinForm.controls).forEach(key => {
        this.signinForm.get(key)?.markAsTouched();
      });
    }
  }

  // Helper method to check if field has error
  hasError(controlName: string, errorType: string): boolean {
    const control = this.signinForm.get(controlName);
    return control ? control.hasError(errorType) && control.touched : false;
  }
}