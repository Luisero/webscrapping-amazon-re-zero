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
const Scrapper_1 = require("./models/Scrapper");
const puppeteer_1 = __importDefault(require("puppeteer"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    let url = 'https://www.amazon.com.br/s?k=re+zero&__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2NFB5D1F7SH5B&sprefix=re+zero+%2Caps%2C166&ref=nb_sb_noss_2';
    let browser = yield puppeteer_1.default.launch({
        headless: false,
        userDataDir: './tmp'
    });
    let page = yield browser.newPage();
    yield page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
    });
    let scrapper = new Scrapper_1.Scrapper(browser, page, url);
    yield scrapper.init();
}))();
