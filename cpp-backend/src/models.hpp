#pragma once
#include <string>
#include <vector>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

struct Product {
    int id;
    std::string name;
    std::string description;
    double price;
    std::string image;
    std::string category;
    int stock;
};

struct Coupon {
    std::string code;
    enum Type {
        FIXED,
        PERCENTAGE
    } type;
    double value;
    double minAmount;
    double maxDiscount;
    std::string description;
    bool isActive;
};

struct CartItem {
    Product product;
    int quantity;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(Product, id, name, description, price, image, category, stock);
