"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scrapper = void 0;
const Product_1 = require("./Product");
const fs = __importStar(require("fs"));
class Scrapper {
    constructor(browser, page, url) {
        this.products = [];
        this.url = 'example.com';
        this.url = url;
        this.browser = browser;
        this.page = page;
    }
    /**
     * init
     */
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.setViewport({
                width: 1920,
                height: 1080
            });
            yield this.page.goto(this.url, {
                waitUntil: 'load'
            });
            yield this.page.screenshot({
                path: 're-zero.png'
            });
            const products = yield this.getProductsInfos();
            console.log(yield this.hasNextPage());
            yield this.browser.close();
        });
    }
    hasNextPage() {
        return __awaiter(this, void 0, void 0, function* () {
            const nextButton = yield this.page.$('.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator');
            const hasNextPage = nextButton !== null;
            return hasNextPage;
        });
    }
    parseFormatedPriceToFloat(formatedPrice) {
        if (formatedPrice === null || formatedPrice === undefined)
            return 0;
        const price = Number.parseFloat(formatedPrice.replace('R$', '').replace(',', '.'));
        return price;
    }
    /**
     * getProductContainer
     */
    getProductContainer(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const productHandles = yield this.page.$$(query);
            return productHandles;
        });
    }
    getProductTitle(productHandle) {
        return __awaiter(this, void 0, void 0, function* () {
            const title = yield this.page.evaluate((el) => { var _a; return (_a = el.querySelector('h2 > a > span')) === null || _a === void 0 ? void 0 : _a.textContent; }, productHandle);
            if (title === null || title === undefined)
                return "";
            return title;
        });
    }
    getProductPrice(productHandle) {
        return __awaiter(this, void 0, void 0, function* () {
            const formatedPrice = yield this.page.evaluate((el) => { var _a; return (_a = el.querySelector('.a-price span[aria-hidden="true"]')) === null || _a === void 0 ? void 0 : _a.textContent; }, productHandle);
            const price = this.parseFormatedPriceToFloat(formatedPrice);
            return price;
        });
    }
    getProductImageUrl(productHandle) {
        return __awaiter(this, void 0, void 0, function* () {
            const image_url = yield this.page.evaluate((el) => { var _a; return (_a = el.querySelector('.s-image')) === null || _a === void 0 ? void 0 : _a.getAttribute('src'); }, productHandle);
            if (image_url === null || image_url === undefined)
                return '';
            return image_url;
        });
    }
    goToNextPage() {
        return __awaiter(this, void 0, void 0, function* () {
            let buttonNextSelector = '.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator';
            yield this.page.click(buttonNextSelector);
            yield this.page.waitForSelector(buttonNextSelector, {
                visible: true,
                timeout: 15000
            });
        });
    }
    saveProductToCSV(product) {
        const { title, price, description, image_url } = product;
        fs.appendFile('results.csv', `${title};${price};${description};${image_url}\n`, (e) => {
            if (e)
                throw e;
            console.log('Saved');
        });
    }
    getProductsInfos() {
        return __awaiter(this, void 0, void 0, function* () {
            let products = [];
            let numberOfScannedPages = 1;
            const productHandles = yield this.getProductContainer('.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item');
            let hasNextPage = yield this.hasNextPage();
            while (hasNextPage) {
                for (const productHandle of productHandles) {
                    try {
                        const title = yield this.getProductTitle(productHandle);
                        const price = yield this.getProductPrice(productHandle);
                        const image_url = yield this.getProductImageUrl(productHandle);
                        const description = '';
                        let product = new Product_1.Product(title, price, image_url, description);
                        if (price > 0) {
                            products.push(product);
                            this.saveProductToCSV(product);
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                console.log(`Pages scanned: ${numberOfScannedPages}`);
                try {
                    yield this.goToNextPage();
                }
                catch (error) {
                    console.log('There is no more pages.');
                    break;
                }
                if (!hasNextPage) {
                    break;
                }
                hasNextPage = yield this.hasNextPage();
                numberOfScannedPages++;
            }
            console.log(products);
            return products;
        });
    }
}
exports.Scrapper = Scrapper;
