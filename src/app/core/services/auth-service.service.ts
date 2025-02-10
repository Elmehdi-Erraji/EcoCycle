import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';  // Import the Store
import { User } from '../models/user.model';
import { refreshUserData } from '../state/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private store: Store  // Inject the Store here
  ) {
    // Load dummy collectors from JSON if not already in local storage
    this.initializeCollectors();
  }

  /**
   * Loads collectors from the JSON file in assets if not already stored.
   */
  private initializeCollectors(): void {
    if (!localStorage.getItem('collectors')) {
      this.http.get<User[]>('assets/collectors.json').subscribe({
        next: (data) => {
          localStorage.setItem('collectors', JSON.stringify(data));
        },
        error: (error) => {
          console.error('Error loading collectors JSON', error);
        }
      });
    }
  }

  /**
   * Register a new user (particulier).
   * Returns true if successful, false if the email already exists.
   */
  register(user: User): boolean {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if the user already exists
    if (users.find(u => u.email === user.email)) {
      return false;
    }

    // Optionally, initialize the score for a particulier if not already provided
    if (user.role === 'particulier' && (user.score === undefined || user.score === null)) {
      user.score = 0;
    }

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    // Optionally, auto-login after registration.
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  }

  /**
   * Log in using email and password.
   * Returns true if the credentials are valid.
   */
  login(email: string, password: string): boolean {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.store.dispatch(refreshUserData());
      return true;
    }

    // Also check in collectors if needed.
    const collectors: User[] = JSON.parse(localStorage.getItem('collectors') || '[]');
    user = collectors.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.store.dispatch(refreshUserData());
      return true;
    }

    return false;
  }

  /**
   * Logs out the current user.
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  /**
   * Checks whether a user is currently authenticated.
   */
  isAuthenticated(): boolean {
    return localStorage.getItem('currentUser') != null;
  }

  /**
   * Returns the current user.
   */
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  }
}
