import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Coupon, mockCoupons } from '../models/coupon';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private appliedCouponSubject = new BehaviorSubject<Coupon | null>(null);
  appliedCoupon$ = this.appliedCouponSubject.asObservable();

  constructor() {
    // 从localStorage加载已应用的优惠券
    const savedCoupon = localStorage.getItem('appliedCoupon');
    if (savedCoupon) {
      try {
        this.appliedCouponSubject.next(JSON.parse(savedCoupon));
      } catch {
        this.appliedCouponSubject.next(null);
      }
    }
  }

  private saveCoupon(coupon: Coupon | null): void {
    if (coupon) {
      localStorage.setItem('appliedCoupon', JSON.stringify(coupon));
    } else {
      localStorage.removeItem('appliedCoupon');
    }
    this.appliedCouponSubject.next(coupon);
  }

  validateCoupon(code: string, subtotal: number): { success: boolean; message: string } {
    const coupon = mockCoupons.find(
      c => c.code.toLowerCase() === code.trim().toLowerCase() && c.isActive
    );

    if (!coupon) {
      return { success: false, message: '优惠券不存在或已过期' };
    }

    if (subtotal < coupon.minAmount) {
      if (coupon.minAmount === 0) {
        return { success: true, message: `优惠券「${coupon.code}」应用成功！${coupon.description}` };
      }
      return {
        success: false,
        message: `订单金额满${coupon.minAmount}元才可使用，当前金额¥${subtotal.toFixed(2)}`
      };
    }

    this.saveCoupon(coupon);
    return { success: true, message: `优惠券「${coupon.code}」应用成功！${coupon.description}` };
  }

  calculateDiscount(subtotal: number): number {
    const coupon = this.appliedCouponSubject.value;
    if (!coupon) return 0;

    let discount = 0;

    if (coupon.type === 'fixed') {
      discount = coupon.value;
    } else if (coupon.type === 'percentage') {
      discount = subtotal * (coupon.value / 100);
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    }

    return Math.min(discount, subtotal); // 折扣不能超过订单总额
  }

  removeCoupon(): void {
    this.saveCoupon(null);
  }

  getAppliedCoupon(): Coupon | null {
    return this.appliedCouponSubject.value;
  }
}
