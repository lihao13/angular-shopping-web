export interface Coupon {
  code: string;
  type: 'fixed' | 'percentage'; // 固定金额 | 百分比
  value: number; // 金额 或 百分比(如 10 = 10%)
  minAmount: number; // 最低使用金额
  maxDiscount?: number; // 最大折扣金额（百分比时可用）
  description: string;
  isActive: boolean;
}

// 模拟优惠券数据
export const mockCoupons: Coupon[] = [
  {
    code: 'SAVE10',
    type: 'fixed',
    value: 10,
    minAmount: 50,
    description: '满50减10元',
    isActive: true
  },
  {
    code: '20OFF',
    type: 'percentage',
    value: 20,
    minAmount: 100,
    maxDiscount: 50,
    description: '全场8折，最高减50元',
    isActive: true
  },
  {
    code: 'NEWUSER',
    type: 'fixed',
    value: 30,
    minAmount: 200,
    description: '新用户专享，满200减30元',
    isActive: true
  },
  {
    code: 'FREE5',
    type: 'fixed',
    value: 5,
    minAmount: 0,
    description: '无门槛减5元',
    isActive: true
  }
];
