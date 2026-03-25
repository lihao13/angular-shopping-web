# C++ 购物网站后端

使用 C++17 构建的购物网站后端，提供 RESTful API，功能和 Angular 前端完全一致。

## 技术栈

- **cpp-httplib** - 单头文件 C++ HTTP/HTTPS 库
- **nlohmann/json** - 单头文件 JSON 解析库
- **CMake** - 构建系统

## 功能特性

✅ 商品列表 API  
✅ 优惠券验证（支持固定金额和百分比折扣）  
✅ 购物车管理（创建、添加商品、更新数量、删除、清空）  
✅ 结算计算  
✅ CORS 支持，可对接前端  
✅ 全内存存储，适合演示

## 构建和运行

### 依赖
需要 CMake 3.14+ 和 C++17 兼容的编译器（GCC 7+、Clang 6+、MSVC 2019+）

### 构建步骤

```bash
cd cpp-backend
mkdir build && cd build
cmake ..
make -j$(nproc)
```

### 运行

```bash
./server
```

服务器启动后监听 `http://0.0.0.0:8080`

## API 文档

| 方法 | 路径 | 功能 |
|------|------|------|
| GET | `/api/products` | 获取所有商品 |
| GET | `/api/coupons` | 获取所有可用优惠券 |
| POST | `/api/coupons/validate` | 验证优惠券 |
| POST | `/api/cart/create` | 创建新购物车 |
| GET | `/api/cart/{id}` | 获取购物车内容 |
| POST | `/api/cart/{id}/add` | 添加商品到购物车 |
| PUT | `/api/cart/{id}/update` | 更新商品数量 |
| DELETE | `/api/cart/{id}/remove/{product_id}` | 删除商品 |
| DELETE | `/api/cart/{id}` | 清空购物车 |
| POST | `/api/cart/{id}/checkout` | 结算 |

### 优惠券测试码

和前端一致：
- `SAVE10` - 满50减10元
- `20OFF` - 全场8折，最高减50元（满100可用）
- `NEWUSER` - 新用户满200减30
- `FREE5` - 无门槛减5元

## 对接前端

前端 Angular 项目可以修改 API 地址指向这个 C++ 后端，即可使用后端服务。
