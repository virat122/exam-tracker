import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../core/services/theme.service';

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
  pin = '';

  errorMessage = '';

  constructor(private router: Router, public theme: ThemeService) {}

  login(): void {

    this.errorMessage = '';

    const student = this.students.find(
      student => student.id === this.selectedStudent
    );

    if (!student) {
      this.errorMessage = 'Please select a student';
      return;
    }

    if (student.pin !== this.pin) {
      this.errorMessage = 'Invalid PIN';
      return;
    }

    // Store logged-in student temporarily
    sessionStorage.setItem(
      'loggedInStudentId',
      student.id.toString()
    );

    sessionStorage.setItem(
      'loggedInStudentName',
      student.name
    );

    // Navigate to dashboard
    this.router.navigate(['/dashboard']);
  }
}
