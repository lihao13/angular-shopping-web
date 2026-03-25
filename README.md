# Angular 21 独立购物网页

一个使用 Angular 21 构建的独立购物网页应用，支持商品浏览、购物车管理、本地存储等功能。

## 技术栈

- **Angular 21** - 最新版本 Angular 框架，使用 standalone 独立组件模式
- **TypeScript** - 类型安全
- **CSS** - 响应式布局
- **LocalStorage** - 购物车数据本地存储

## 功能特性

✅ 商品列表展示
✅ 加入购物车
✅ 购物车管理（修改数量、删除商品）
✅ 价格计算
✅ 深色/浅色？不，使用了清爽的现代风格设计
✅ 响应式布局，支持移动端
✅ 本地存储持久化购物车数据

## 项目结构

```
src/app/
├── models/
│   └── product.ts              # 商品数据模型和模拟数据
├── services/
│   └── cart.service.ts         # 购物车服务（状态管理+本地存储）
├── components/
│   ├── product-card/          # 商品卡片组件
│   ├── product-list/          # 商品列表组件
│   └── cart/                  # 购物车组件
├── app.ts                      # 主应用组件
├── app.html                    # 主应用模板
├── app.css                     # 全局样式
├── app.routes.ts               # 路由配置
└── app.config.ts               # 应用配置
```

## 如何运行

### 本地开发

1. 确保你已经安装了 Node.js 和 Angular CLI
2. 克隆项目：
```bash
git clone <your-repo-url>
cd angular-shopping-web
```

3. 安装依赖：
```bash
npm install
```

4. 启动开发服务器：
```bash
npm start
```

5. 打开浏览器访问 `http://localhost:4200`

### 构建生产版本

```bash
npm run build
```

构建产物会输出到 `dist/` 目录，可以部署到任何静态网站托管服务。

## 功能说明

### 商品列表
- 响应式网格布局，自动适配不同屏幕尺寸
- 每个商品显示图片、名称、分类、描述、价格
- 点击加入购物车按钮添加商品

### 购物车
- 显示所有已添加商品
- 支持增减商品数量
- 实时计算总价
- 删除商品
- 清空购物车
- 数据自动保存到浏览器本地存储，刷新页面不会丢失

## 未来可以扩展的功能

- 添加商品搜索和分类筛选
- 添加用户登录和订单管理
- 接入真实支付系统
- 添加商品详情页
- 支持多地址管理
- 添加优惠券功能

## 许可证

MIT License
