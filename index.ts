import {Scrapper} from './models/Scrapper';
import puppeteer, { Browser, Page } from 'puppeteer';

(async () => {
    
    let url = 'https://www.amazon.com.br/s?k=re+zero&__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=2NFB5D1F7SH5B&sprefix=re+zero+%2Caps%2C166&ref=nb_sb_noss_2';
    
    let browser: Browser = await puppeteer.launch({
        headless: false,
        userDataDir:'./tmp'
    });

    let page: Page = await browser.newPage();
    await page.setViewport({
        width:1920,
        height:1080,
        deviceScaleFactor:1,
    });

    let scrapper: Scrapper = new Scrapper(browser, page,url);

    await scrapper.init();
})();
