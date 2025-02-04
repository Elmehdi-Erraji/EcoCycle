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
    // Select the auth state slices
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Subscribe to user state; navigate when login is successful.
    this.user$.subscribe(user => {
      if (user) {
        this.router.navigate(['/success']);
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      // Use AuthService synchronously to check credentials
      const success = this.authService.login(email, password);
      if (success) {
        // Get the current user (from local storage or AuthService) and dispatch a success action
        const currentUser = this.authService.getCurrentUser();
        this.store.dispatch(AuthActions.loginSuccess({ user: currentUser! }));
      } else {
        // Dispatch a failure action with an error message
        this.store.dispatch(AuthActions.loginFailure({ error: 'Invalid email or password' }));
      }
    }
  }
}
