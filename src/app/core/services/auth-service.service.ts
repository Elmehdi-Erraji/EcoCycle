import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  dateOfBirth: string; // Format: YYYY-MM-DD
  profilePicture?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router, private http: HttpClient) {
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

    if (users.find(u => u.email === user.email)) {
      return false; // User already exists.
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
      return true;
    }

    // Also check in collectors if needed.
    const collectors: User[] = JSON.parse(localStorage.getItem('collectors') || '[]');
    user = collectors.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
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

  getCurrentUser(): User | null {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  }
}
