import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems$: Observable<CartItem[]>;

  constructor(public cartService: CartService) {
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
    }
  }

  checkout(): void {
    alert('感谢您的购买！这是一个演示项目，实际支付功能需要对接支付系统。');
    this.cartService.clearCart();
  }
}
