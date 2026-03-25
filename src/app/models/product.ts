export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

// 模拟商品数据
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    description: '最新款苹果智能手机，A17 Pro芯片，钛金属边框',
    price: 7999,
    image: 'https://picsum.photos/seed/iphone15/400/300',
    category: '电子产品',
    stock: 10
  },
  {
    id: 2,
    name: 'MacBook Air M2',
    description: '轻薄便携笔记本电脑，M2芯片，超长续航',
    price: 8999,
    image: 'https://picsum.photos/seed/macbook/400/300',
    category: '电子产品',
    stock: 5
  },
  {
    id: 3,
    name: 'AirPods Pro 2',
    description: '主动降噪无线耳机，空间音频，超长续航',
    price: 1899,
    image: 'https://picsum.photos/seed/airpods/400/300',
    category: '音频',
    stock: 20
  },
  {
    id: 4,
    name: 'Nike Air Max 运动鞋',
    description: '舒适透气运动鞋，适合运动和日常穿着',
    price: 799,
    image: 'https://picsum.photos/seed/nike/400/300',
    category: '服装',
    stock: 30
  },
  {
    id: 5,
    name: 'Adidas 运动背包',
    description: '大容量运动背包，适合健身和旅行',
    price: 299,
    image: 'https://picsum.photos/seed/adidas/400/300',
    category: '配饰',
    stock: 15
  },
  {
    id: 6,
    name: 'Sony WH-1000XM5 耳机',
    description: '业界顶级降噪耳机，高清音质，30小时续航',
    price: 2499,
    image: 'https://picsum.photos/seed/sony/400/300',
    category: '音频',
    stock: 8
  }
];
