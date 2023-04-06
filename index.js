"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({
        headless: false,
        defaultViewport: null
    });
    const page = yield browser.newPage();
    yield page.setViewport({
        width: 1920,
        height: 1080
    });
    let url = 'https://www.amazon.com.br/s?k=re+zero&__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1GU6IIMG4M272&sprefix=re+zero%2Caps%2C163&ref=nb_sb_noss_1';
    yield page.goto(url);
    yield page.screenshot({
        path: 're-zero.png'
    });
    const productHandles = yield page.$$('.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item');
    for (const productHandle of productHandles) {
        try {
            const title = yield page.evaluate((el) => { var _a; return (_a = el.querySelector('h2 > a > span')) === null || _a === void 0 ? void 0 : _a.textContent; }, productHandle);
            const price = yield page.evaluate((el) => { var _a; return (_a = el.querySelector('.a-price span[aria-hidden="true"]')) === null || _a === void 0 ? void 0 : _a.textContent; }, productHandle);
            console.log(`${title} - ${price}`);
        }
        catch (error) {
        }
    }
}))();
