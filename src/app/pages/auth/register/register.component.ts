import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService, User} from '../../../core/services/auth-service.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      profilePicture: ['']
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const newUser: User = this.registerForm.value;
      // Set the role for a 'particulier'
      newUser.role = 'particulier';
      if (this.authService.register(newUser)) {
        // Navigate to home (or another page) on successful registration
        this.router.navigate(['/home']);
      } else {
        this.errorMsg = 'A user with this email already exists.';
      }
    }
  }
}
