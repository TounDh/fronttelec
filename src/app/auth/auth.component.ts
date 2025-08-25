import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from '../signin/signin.component';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, SigninComponent, SignupComponent],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  showSignIn = true;

  toggleForm() {
    console.log('Toggling form, new state:', !this.showSignIn); // Debug log
    this.showSignIn = !this.showSignIn;
  }
}