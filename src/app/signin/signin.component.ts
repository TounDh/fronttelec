import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  @Output() toggleToSignUp = new EventEmitter<void>(); // Event to trigger sign-up

  switchToSignUp() {
    this.toggleToSignUp.emit(); // Emit event to switch to sign-up
  }
}