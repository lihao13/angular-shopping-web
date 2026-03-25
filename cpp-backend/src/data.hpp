#pragma once
#include "models.hpp"
#include <vector>

inline std::vector<Product> getMockProducts() {
    return {
        {
            1,
            "iPhone 15 Pro",
            "最新款苹果智能手机，A17 Pro芯片，钛金属边框",
            7999.0,
            "https://picsum.photos/seed/iphone15/400/300",
            "电子产品",
            10
        },
        {
            2,
            "MacBook Air M2",
            "轻薄便携笔记本电脑，M2芯片，超长续航",
            8999.0,
            "https://picsum.photos/seed/macbook/400/300",
            "电子产品",
            5
        },
        {
            3,
            "AirPods Pro 2",
            "主动降噪无线耳机，空间音频，超长续航",
            1899.0,
            "https://picsum.photos/seed/airpods/400/300",
            "音频",
            20
        },
        {
            4,
            "Nike Air Max 运动鞋",
            "舒适透气运动鞋，适合运动和日常穿着",
            799.0,
            "https://picsum.photos/seed/nike/400/300",
            "服装",
            30
        },
        {
            5,
            "Adidas 运动背包",
            "大容量运动背包，适合健身和旅行",
            299.0,
            "https://picsum.photos/seed/adidas/400/300",
            "配饰",
            15
        },
        {
            6,
            "Sony WH-1000XM5 耳机",
            "业界顶级降噪耳机，高清音质，30小时续航",
            2499.0,
            "https://picsum.photos/seed/sony/400/300",
            "音频",
            8
        }
    };
}

inline std::vector<Coupon> getMockCoupons() {
    return {
        {
            "SAVE10",
            Coupon::FIXED,
            10.0,
            50.0,
            0.0,
            "满50减10元",
            true
        },
        {
            "20OFF",
            Coupon::PERCENTAGE,
            20.0,
            100.0,
            50.0,
            "全场8折，最高减50元",
            true
        },
        {
            "NEWUSER",
            Coupon::FIXED,
            30.0,
            200.0,
            0.0,
            "新用户专享，满200减30元",
            true
        },
        {
            "FREE5",
            Coupon::FIXED,
            5.0,
            0.0,
            0.0,
            "无门槛减5元",
            true
        }
    };
}
