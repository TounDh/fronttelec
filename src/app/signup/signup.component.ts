import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  @Output() toggleToSignIn = new EventEmitter<void>(); // Event to trigger sign-in

  switchToSignIn() {
    this.toggleToSignIn.emit(); // Emit event to switch to sign-in
  }
}