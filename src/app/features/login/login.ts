import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../core/services/theme.service';
import { ApiCallService } from '../../core/api-call/api-call';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  students = [
    { id: 1, name: 'Rahul Sharma', pin: '1234' },
    { id: 2, name: 'Amit Kumar', pin: '2345' },
    { id: 3, name: 'Priya Singh', pin: '3456' },
    { id: 4, name: 'Neha Patel', pin: '4567' },
    { id: 5, name: 'Vikram Singh', pin: '5678' }
  ];

  selectedStudent: number | null = null;
  username=""
  pin = '';

  errorMessage = '';

  constructor(private router: Router, public theme: ThemeService ,public apiCallService :ApiCallService) {}

  login(): void {
  this.errorMessage = '';

  if (!this.username.trim() || this.pin.length !== 4) {
    this.errorMessage = 'Username and PIN are required';
    return;
  }

  const payload = {
    username: this.username.trim(),
    password: this.pin
  };

  this.apiCallService.login(payload).subscribe({
    next: (response) => {

      sessionStorage.setItem(
        'loggedInStudentId',
        response.student.id.toString()
      );

      sessionStorage.setItem(
        'loggedInStudentName',
        response.student.name
      );

      this.router.navigate(['/dashboard']);
    },

    error: (error) => {
      this.errorMessage =
        error.error?.message || 'Invalid username or PIN';
    }
  });
}
}
