import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as AuthActions from '../../../core/state/auth/auth.actions';
import { selectUser, selectAuthLoading, selectAuthError } from '../../../core/state/auth/auth.selectors';
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
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.user$.subscribe(user => {
      if (user) {
        if (user.role) {
          this.redirectUser(user.role);
        } else {
          this.router.navigate(['/success']);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const success = this.authService.login(email, password);
      if (success) {
        const currentUser = this.authService.getCurrentUser();
        this.store.dispatch(AuthActions.loginSuccess({ user: currentUser! }));
      } else {
        this.store.dispatch(AuthActions.loginFailure({ error: 'Invalid email or password' }));
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private redirectUser(role: string): void {
    switch (role) {
      case 'collector':
        this.router.navigate(['/collector']);
        break;
      case 'particulier':
        this.router.navigate(['/particulier']);
        break;
      default:
        this.router.navigate(['/success']);
        break;
    }
  }
}
