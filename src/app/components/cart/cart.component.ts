import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { CouponService } from '../../services/coupon.service';
import { Coupon } from '../../models/coupon';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems$: Observable<CartItem[]>;
  couponCode: string = '';
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(public cartService: CartService, public couponService: CouponService) {
    this.cartItems$ = this.cartService.cartItems$;
  }

  updateQuantity(item: CartItem, quantity: number): void {
    this.cartService.updateQuantity(item.product.id, quantity);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    if (confirm('确定要清空购物车吗？')) {
      this.cartService.clearCart();
      this.couponService.removeCoupon();
      this.message = '';
    }
  }

  applyCoupon(): void {
    if (!this.couponCode.trim()) {
      this.message = '请输入优惠券码';
      this.messageType = 'error';
      return;
    }

    const subtotal = this.cartService.getTotalPrice();
    const result = this.couponService.validateCoupon(this.couponCode, subtotal);
    this.message = result.message;
    this.messageType = result.success ? 'success' : 'error';

    if (result.success) {
      this.couponCode = '';
    }
  }

  removeCoupon(): void {
    this.couponService.removeCoupon();
    this.message = '优惠券已移除';
    this.messageType = 'success';
  }

  getSubtotal(): number {
    return this.cartService.getTotalPrice();
  }

  getDiscount(): number {
    return this.couponService.calculateDiscount(this.getSubtotal());
  }

  getFinalTotal(): number {
    return Math.max(0, this.getSubtotal() - this.getDiscount());
  }

  getAppliedCoupon(): Coupon | null {
    return this.couponService.getAppliedCoupon();
  }

  checkout(): void {
    const finalTotal = this.getFinalTotal();
    alert(`感谢您的购买！\n订单总额：¥${finalTotal.toFixed(2)}\n这是一个演示项目，实际支付功能需要对接支付系统。`);
    this.cartService.clearCart();
    this.couponService.removeCoupon();
    this.message = '';
  }
}
