import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as AuthActions from '../../../core/state/auth.actions';
import { selectUser, selectAuthLoading, selectAuthError } from '../../../core/state/auth.selectors';
import { AuthService } from '../../../core/services/auth-service.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  user$: Observable<any>;

  constructor(
      private fb: FormBuilder,
      private store: Store,
      private router: Router,
      private authService: AuthService
  ) {
    // Select the auth state slices from the store
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      // Optionally add Validators.minLength(6) if you need a minimum length for password.
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Subscribe to the user state; when a user is available, redirect based on their role.
    this.user$.subscribe(user => {
      if (user) {
        if (user.role) {
          this.redirectUser(user.role);
        } else {
          // Fallback redirection if no role is provided
          this.router.navigate(['/success']);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      // Check credentials synchronously via AuthService
      const success = this.authService.login(email, password);
      if (success) {
        // Retrieve the current user (which is assumed to include a role) and dispatch a success action
        const currentUser = this.authService.getCurrentUser();
        this.store.dispatch(AuthActions.loginSuccess({ user: currentUser! }));
      } else {
        // Dispatch a failure action with an error message
        this.store.dispatch(AuthActions.loginFailure({ error: 'Invalid email or password' }));
      }
    } else {
      // Mark all fields as touched to trigger validation messages
      this.loginForm.markAllAsTouched();
    }
  }

  // Redirect the user based on their role
  private redirectUser(role: string): void {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'JURY':
        this.router.navigate(['/jury']);
        break;
      case 'MEMBER':
        this.router.navigate(['/member']);
        break;
      default:
        this.router.navigate(['/success']);
        break;
    }
  }
}
