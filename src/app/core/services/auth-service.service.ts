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
    private store: Store
  ) {
    this.initializeCollectors();
  }


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


  register(user: User): boolean {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.find(u => u.email === user.email)) {
      return false;
    }


    if (user.role === 'particulier' && (user.score === undefined || user.score === null)) {
      user.score = 0;
    }

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(user));
    return true;
  }


  login(email: string, password: string): boolean {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    let user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.store.dispatch(refreshUserData());
      return true;
    }

    const collectors: User[] = JSON.parse(localStorage.getItem('collectors') || '[]');
    user = collectors.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.store.dispatch(refreshUserData());
      return true;
    }

    return false;
  }


  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

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
