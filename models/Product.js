"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(title, price, description) {
        this.price_ = 0;
        this.title_ = title;
        this.price_ = price;
        this.description = description;
    }
    get title() {
        return this.title_;
    }
    set title(title) {
        this.title_ = title;
    }
    get price() {
        return this.price_;
    }
    set price(price) {
        this.price_ = price;
    }
}
exports.Product = Product;
