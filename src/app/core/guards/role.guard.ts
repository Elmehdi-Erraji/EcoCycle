import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth-service.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser: User | null = this.authService.getCurrentUser();

    if (!currentUser) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRoles = route.data['roles'] as string[];

    if (requiredRoles && !requiredRoles.includes(currentUser.role)) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
