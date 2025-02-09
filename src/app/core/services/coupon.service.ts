// coupon.service.ts
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service.service';
import { User } from '../models/user.model';

export interface Coupon {
  value: number;
  requiredPoints: number;
  createdAt: Date;
  userEmail: string;
  code: string; // unique coupon code
}

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  constructor(private authService: AuthService) {}

  /**
   * Retrieves the current user's score.
   */
  getUserScore(): number {
    const user = this.authService.getCurrentUser();
    return user ? (user.score ?? 0) : 0;
  }

  /**
   * Updates the current user's score in local storage.
   */
  private updateUserScore(newScore: number): void {
    const user: User | null = this.authService.getCurrentUser();
    if (user) {
      user.score = newScore;
      localStorage.setItem('currentUser', JSON.stringify(user));
      // Optionally, update the users array if required.
    }
  }

  /**
   * Retrieves all coupons associated with the current user.
   */
  getCoupons(): Coupon[] {
    const allCoupons: Coupon[] = JSON.parse(localStorage.getItem('coupons') || '[]');
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return [];
    }
    return allCoupons.filter(coupon => coupon.userEmail === currentUser.email);
  }

  /**
   * Creates a coupon if the current user has enough points.
   * Deducts the required points and saves the coupon.
   */
  createCoupon(requiredPoints: number, couponValue: number): Coupon | null {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return null;
    }
    const currentScore = currentUser.score ?? 0;
    if (currentScore < requiredPoints) {
      return null;
    }

    // Deduct points and update the user's score.
    const newScore = currentScore - requiredPoints;
    this.updateUserScore(newScore);

    // Generate a unique coupon code (for example: CPN- followed by 8 random alphanumeric characters)
    const couponCode = 'CPN-' + Math.random().toString(36).substr(2, 8).toUpperCase();

    // Create the coupon.
    const coupon: Coupon = {
      value: couponValue,
      requiredPoints,
      createdAt: new Date(),
      userEmail: currentUser.email,
      code: couponCode
    };

    // Retrieve all coupons, add the new coupon, and save them.
    const allCoupons: Coupon[] = JSON.parse(localStorage.getItem('coupons') || '[]');
    allCoupons.push(coupon);
    localStorage.setItem('coupons', JSON.stringify(allCoupons));

    return coupon;
  }
}
