import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import {AuthService, User} from '../services/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser: User | null = this.authService.getCurrentUser();

    // If no user is logged in, redirect to login.
    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    // Get the allowed roles from route data (for example: data: { roles: ['admin'] })
    const requiredRoles = route.data['roles'] as Array<string>;
    if (requiredRoles && requiredRoles.indexOf(currentUser.role as string) === -1) {
      // The user's role is not authorized: redirect to an "unauthorized" page or home.
      this.router.navigate(['/unauthorized']); // You can create an UnauthorizedComponent to show a message.
      return false;
    }

    return true;
  }
}
