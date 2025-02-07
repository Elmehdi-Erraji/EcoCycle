import { Component, OnInit } from '@angular/core';
import {Coupon, CouponService} from '../../../../core/services/coupon.service';
import {CommonModule, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-coupons',
  standalone: true,  // if standalone
  imports: [CommonModule],  // <-- Add CommonModule here
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.css']
})
export class CouponsComponent implements OnInit {
  userScore: number = 0;
  coupons: Coupon[] = [];

  constructor(private couponService: CouponService) {}

  ngOnInit(): void {
    this.loadUserScore();
    this.loadCoupons();
  }

  loadUserScore(): void {
    this.userScore = this.couponService.getUserScore();
  }

  loadCoupons(): void {
    this.coupons = this.couponService.getCoupons();
  }

  createCoupon(requiredPoints: number): void {
    if (this.userScore >= requiredPoints) {
      let couponValue = 0;
      if (requiredPoints === 100) {
        couponValue = 50;
      } else if (requiredPoints === 200) {
        couponValue = 120;
      } else if (requiredPoints === 500) {
        couponValue = 350;
      }
      const coupon = this.couponService.createCoupon(requiredPoints, couponValue);
      if (coupon) {
        alert(`Coupon created: ${coupon.value} Dh coupon`);
        this.loadUserScore();
        this.loadCoupons();
      }
    } else {
      alert('Insufficient points to create this coupon.');
    }
  }
}
