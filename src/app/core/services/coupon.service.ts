// coupon.service.ts
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service.service';
import { User } from '../models/user.model';

export interface Coupon {
  value: number;
  requiredPoints: number;
  createdAt: Date;
  userEmail: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  constructor(private authService: AuthService) {}


  getUserScore(): number {
    const user = this.authService.getCurrentUser();
    return user ? (user.score ?? 0) : 0;
  }


  private updateUserScore(newScore: number): void {
    const user: User | null = this.authService.getCurrentUser();
    if (user) {
      user.score = newScore;
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }


  getCoupons(): Coupon[] {
    const allCoupons: Coupon[] = JSON.parse(localStorage.getItem('coupons') || '[]');
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return [];
    }
    return allCoupons.filter(coupon => coupon.userEmail === currentUser.email);
  }


  createCoupon(requiredPoints: number, couponValue: number): Coupon | null {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return null;
    }
    const currentScore = currentUser.score ?? 0;
    if (currentScore < requiredPoints) {
      return null;
    }

    const newScore = currentScore - requiredPoints;
    this.updateUserScore(newScore);

    const couponCode = 'CPN-' + Math.random().toString(36).substr(2, 8).toUpperCase();

    const coupon: Coupon = {
      value: couponValue,
      requiredPoints,
      createdAt: new Date(),
      userEmail: currentUser.email,
      code: couponCode
    };

    const allCoupons: Coupon[] = JSON.parse(localStorage.getItem('coupons') || '[]');
    allCoupons.push(coupon);
    localStorage.setItem('coupons', JSON.stringify(allCoupons));

    return coupon;
  }
}
