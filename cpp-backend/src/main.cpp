#include <iostream>
#include <string>
#include <map>
#include <mutex>
#include "models.hpp"
#include "data.hpp"
#include <httplib.h>
#include <nlohmann/json.hpp>

using json = nlohmann::json;
using namespace httplib;

// 简单的内存购物车存储（演示用）
std::map<int, std::vector<CartItem>> g_carts;
std::mutex g_mutex;
int g_next_cart_id = 1;

// 验证优惠券
struct ValidateCouponResult {
    bool success;
    std::string message;
    double discount;
    Coupon coupon;
};

ValidateCouponResult validateCoupon(const std::string& code, double subtotal) {
    auto coupons = getMockCoupons();
    ValidateCouponResult result;
    result.success = false;
    result.discount = 0;

    for (const auto& coupon : coupons) {
        if (coupon.code == code && coupon.isActive) {
            if (subtotal < coupon.minAmount) {
                result.success = false;
                result.message = "订单金额满" + std::to_string((int)coupon.minAmount) + 
                                "元才可使用，当前金额¥" + std::to_string(subtotal);
                return result;
            }

            double discount = 0;
            if (coupon.type == Coupon::FIXED) {
                discount = coupon.value;
            } else {
                discount = subtotal * (coupon.value / 100.0);
                if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
                    discount = coupon.maxDiscount;
                }
            }

            discount = std::min(discount, subtotal);

            result.success = true;
            result.message = "优惠券「" + coupon.code + "」应用成功！" + coupon.description;
            result.discount = discount;
            result.coupon = coupon;
            return result;
        }
    }

    result.success = false;
    result.message = "优惠券不存在或已过期";
    return result;
}

// CORS头设置
void setCORSHeaders(Response& res) {
    res.set_header("Access-Control-Allow-Origin", "*");
    res.set_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.set_header("Access-Control-Allow-Headers", "Content-Type");
}

int main() {
    Server svr;

    // CORS preflight
    svr.Options("/*", [](const Request& req, Response& res) {
        setCORSHeaders(res);
        res.status = 204;
    });

    // 获取所有商品
    svr.Get("/api/products", [](const Request& req, Response& res) {
        setCORSHeaders(res);
        auto products = getMockProducts();
        json j = json::array();
        for (const auto& p : products) {
            j.push_back({{"id", p.id},
                         {"name", p.name},
                         {"description", p.description},
                         {"price", p.price},
                         {"image", p.image},
                         {"category", p.category},
                         {"stock", p.stock}});
        }
        res.set_content(j.dump(2), "application/json");
    });

    // 获取可用优惠券列表（用于展示）
    svr.Get("/api/coupons", [](const Request& req, Response& res) {
        setCORSHeaders(res);
        auto coupons = getMockCoupons();
        json j = json::array();
        for (const auto& c : coupons) {
            std::string type_str = (c.type == Coupon::FIXED) ? "fixed" : "percentage";
            j.push_back({{"code", c.code},
                         {"type", type_str},
                         {"value", c.value},
                         {"minAmount", c.minAmount},
                         {"maxDiscount", c.maxDiscount},
                         {"description", c.description},
                         {"isActive", c.isActive}});
        }
        res.set_content(j.dump(2), "application/json");
    });

    // 验证优惠券
    svr.Post("/api/coupons/validate", [](const Request& req, Response& res) {
        setCORSHeaders(res);
        auto j = json::parse(req.body);
        std::string code = j["code"];
        double subtotal = j["subtotal"];

        auto result = validateCoupon(code, subtotal);

        json response;
        response["success"] = result.success;
        response["message"] = result.message;
        response["discount"] = result.discount;

        res.set_content(response.dump(2), "application/json");
    });

    // 创建购物车
    svr.Post("/api/cart/create", [](const Request& req, Response& res) {
        setCORSHeaders(res);
        std::lock_guard<std::mutex> lock(g_mutex);
        int cart_id = g_next_cart_id++;
        g_carts[cart_id] = std::vector<CartItem>();

        json response;
        response["cartId"] = cart_id;
        response["items"] = json::array();
        res.set_content(response.dump(2), "application/json");
    });

    // 获取购物车
    svr.Get("/api/cart/:id", [](const Request& req, Response& res) {
        setCORSHeaders(res);
        int cart_id = std::stoi(req.path_params.at("id"));

        std::lock_guard<std::mutex> lock(g_mutex);
        if (g_carts.find(cart_id) == g_carts.end()) {
            res.status = 404;
            json error;
            error["error"] = "Cart not found";
            res.set_content(error.dump(), "application/json");
            return;
        }

        auto& items = g_carts[cart_id];
        json j = json::array();
        double subtotal = 0;

        for (const auto& item : items) {
            j.push_back({{"product", {
                            {"id", item.product.id},
                            {"name", item.product.name},
                            {"description", item.product.description},
                            {"price", item.product.price},
                            {"image", item.product.image},
                            {"category", item.product.category},
                            {"stock", item.product.stock}
                         }},
                         {"quantity", item.quantity}});
            subtotal += item.product.price * item.quantity;
        }

        json response;
        response["cartId"] = cart_id;
        response["items"] = j;
        response["subtotal"] = subtotal;
        res.set_content(response.dump(2), "application/json");
    });

    // 添加商品到购物车
    svr.Post("/api/cart/:id/add", [](const Request& req, Response& res) {
        setCORSHeaders(res);
        int cart_id = std::stoi(req.path_params.at("id"));
        auto j = json::parse(req.body);
        int product_id = j["productId"];
        int quantity = j.value("quantity", 1);

        auto products = getMockProducts();
        Product found_product;
        bool found = false;
        for (const auto& p : products) {
            if (p.id == product_id) {
                found_product = p;
                found = true;
                break;
            }
        }

        if (!found) {
            res.status = 404;
            json error;
            error["error"] = "Product not found";
            res.set_content(error.dump(), "application/json");
            return;
        }

        if (found_product.stock < quantity) {
            res.status = 400;
            json error;
            error["error"] = "Insufficient stock";
            res.set_content(error.dump(), "application/json");
            return;
        }

        std::lock_guard<std::mutex> lock(g_mutex);
        if (g_carts.find(cart_id) == g_carts.end()) {
            g_carts[cart_id] = std::vector<CartItem>();
        }

        auto& cart = g_carts[cart_id];
        bool existing = false;
        for (auto& item : cart) {
            if (item.product.id == product_id) {
                item.quantity += quantity;
                existing = true;
                break;
            }
        }

        if (!existing) {
            CartItem new_item;
            new_item.product = found_product;
            new_item.quantity = quantity;
            cart.push_back(new_item);
        }

        json response;
        response["success"] = true;
        response["message"] = "Product added to cart";
        res.set_content(response.dump(2), "application/json");
    });

    // 更新商品数量
    svr.Put("/api/cart/:id/update", [](const Request& req, Response& res) {
        setCORSHeaders(res);
        int cart_id = std::stoi(req.path_params.at("id"));
        auto j = json::parse(req.body);
        int product_id = j["productId"];
        int quantity = j["quantity"];

        std::lock_guard<std::mutex> lock(g_mutex);
        if (g_carts.find(cart_id) == g_carts.end()) {
            res.status = 404;
            json error;
            error["error"] = "Cart not found";
            res.set_content(error.dump(), "application/json");
            return;
        }

        auto& cart = g_carts[cart_id];
        for (auto it = cart.begin(); it != cart.end(); ++it) {
            if (it->product.id == product_id) {
                if (quantity <= 0) {
                    cart.erase(it);
                } else {
                    it->quantity = quantity;
                }
                break;
            }
        }

        json response;
        response["success"] = true;
        response["message"] = "Cart updated";
        res.set_content(response.dump(2), "application/json");
    });

    // 删除商品
    svr.Delete("/api/cart/:id/remove/:product_id", [](const Request& req, Response& res) {
        setCORSHeaders(res);
        int cart_id = std::stoi(req.path_params.at("id"));
        int product_id = std::stoi(req.path_params.at("product_id"));

        std::lock_guard<std::mutex> lock(g_mutex);
        if (g_carts.find(cart_id) == g_carts.end()) {
            res.status = 404;
            json error;
            error["error"] = "Cart not found";
            res.set_content(error.dump(), "application/json");
            return;
        }

        auto& cart = g_carts[cart_id];
        for (auto it = cart.begin(); it != cart.end(); ++it) {
            if (it->product.id == product_id) {
                cart.erase(it);
                break;
            }
        }

        json response;
        response["success"] = true;
        response["message"] = "Product removed";
        res.set_content(response.dump(2), "application/json");
    });

    // 清空购物车
    svr.Delete("/api/cart/:id", [](const Request& req, Response& res) {
        setCORSHeaders(res);
        int cart_id = std::stoi(req.path_params.at("id"));

        std::lock_guard<std::mutex> lock(g_mutex);
        if (g_carts.find(cart_id) != g_carts.end()) {
            g_carts[cart_id].clear();
        }

        json response;
        response["success"] = true;
        response["message"] = "Cart cleared";
        res.set_content(response.dump(2), "application/json");
    });

    // 结算
    svr.Post("/api/cart/:id/checkout", [](const Request& req, Response& res) {
        setCORSHeaders(res);
        int cart_id = std::stoi(req.path_params.at("id"));
        auto j = json::parse(req.body);
        std::string coupon_code = j.value("couponCode", "");
        double subtotal = j["subtotal"];
        double discount = 0;

        if (!coupon_code.empty()) {
            auto result = validateCoupon(coupon_code, subtotal);
            if (result.success) {
                discount = result.discount;
            }
        }

        double final_total = std::max(0.0, subtotal - discount);

        std::lock_guard<std::mutex> lock(g_mutex);
        if (g_carts.find(cart_id) != g_carts.end()) {
            g_carts[cart_id].clear();
        }

        json response;
        response["success"] = true;
        response["message"] = "Checkout successful";
        response["finalTotal"] = final_total;
        res.set_content(response.dump(2), "application/json");
    });

    std::cout << "C++ Shopping Backend starting..." << std::endl;
    std::cout << "Server listening on http://localhost:8080" << std::endl;
    std::cout << "Available APIs:" << std::endl;
    std::cout << "  GET  /api/products - Get all products" << std::endl;
    std::cout << "  GET  /api/coupons - Get available coupons" << std::endl;
    std::cout << "  POST /api/coupons/validate - Validate coupon" << std::endl;
    std::cout << "  POST /api/cart/create - Create new cart" << std::endl;
    std::cout << "  GET  /api/cart/{id} - Get cart" << std::endl;
    std::cout << "  POST /api/cart/{id}/add - Add product to cart" << std::endl;
    std::cout << "  PUT  /api/cart/{id}/update - Update product quantity" << std::endl;
    std::cout << "  DELETE /api/cart/{id}/remove/{product_id} - Remove product" << std::endl;
    std::cout << "  DELETE /api/cart/{id} - Clear cart" << std::endl;
    std::cout << "  POST /api/cart/{id}/checkout - Checkout" << std::endl;

    svr.listen("0.0.0.0", 8080);
    return 0;
}
