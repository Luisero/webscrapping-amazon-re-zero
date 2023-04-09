import { Browser, ElementHandle, Page } from "puppeteer";
import { Product } from "./Product";
import * as fs from 'fs';


export class Scrapper {
    products: Product[] = [];

    url: string = 'example.com';
    browser: Browser;
    page: Page;

    constructor(browser: Browser, page: Page, url: string) {
        this.url = url;
        this.browser = browser;
        this.page = page;
    }

    /**
     * init
     */
    async init() {



        await this.page.setViewport({
            width: 1920,
            height: 1080
        });



        await this.page.goto(this.url, {
            waitUntil: 'load'
        });

        await this.page.screenshot({
            path: 're-zero.png'
        });


        const products: Product[] = await this.getProductsInfos();
        


        console.log(await this.hasNextPage())

        await this.browser.close();
    }
    
    async hasNextPage() {

        const nextButton = await this.page.$('.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator');
        
        const hasNextPage: boolean = nextButton !== null;
        
        return hasNextPage;

        
    }

    parseFormatedPriceToFloat(formatedPrice: string | null | undefined): number {
        if (formatedPrice === null || formatedPrice === undefined) return 0;
        
        const price = Number.parseFloat(formatedPrice.replace('R$', '').replace(',', '.'));

        return price;
    }

    /**
     * getProductContainer
     */
    async getProductContainer(query: string) {
        const productHandles = await this.page.$$(query);
        return productHandles;
    }
    async getProductTitle(productHandle: ElementHandle<Element>): Promise<string> {
        const title = await this.page.evaluate((el) => el.querySelector('h2 > a > span')?.textContent, productHandle)

        if (title === null || title === undefined) return "";

        return title;
    }


    async getProductPrice(productHandle: ElementHandle<Element>): Promise<number> {
        const formatedPrice = await this.page.evaluate((el) => el.querySelector('.a-price span[aria-hidden="true"]')?.textContent, productHandle);

        const price = this.parseFormatedPriceToFloat(formatedPrice);
        
        return price;
    }

    async getProductImageUrl(productHandle: ElementHandle<Element>): Promise<string> {
        const image_url = await this.page.evaluate((el) => el.querySelector('.s-image')?.getAttribute('src'), productHandle);

        if (image_url === null || image_url === undefined) return '';
        
        return image_url;

    }
    async goToNextPage(): Promise<void> {
        let buttonNextSelector = '.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-separator';
        await this.page.click(buttonNextSelector);
        await this.page.waitForSelector(buttonNextSelector, {
            visible: true,
            timeout: 15000
        })




    }
    saveProductToCSV(product: Product) {
        const { title, price, description, image_url } = product;

        fs.appendFile('results.csv', `${title};${price};${description};${image_url}\n`, (e) => {
            if (e) throw e;
            console.log('Saved')
        })
    }

    async getProductsInfos() {
        let products: Product[] = [];
        let numberOfScannedPages = 1;

        const productHandles = await this.getProductContainer('.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item');

        let hasNextPage: boolean = await this.hasNextPage();
        
        while (hasNextPage) {
            for (const productHandle of productHandles) {
                try {
                    const title: string = await this.getProductTitle(productHandle);
                    const price = await this.getProductPrice(productHandle);

                    const image_url = await this.getProductImageUrl(productHandle);

                    const description = '';

                    let product = new Product(title, price, image_url, description);


                    if (price > 0) {
                        products.push(product);
                        this.saveProductToCSV(product);
                    }


                } catch (error) {
                    console.log(error)
                }
            }
            console.log(`Pages scanned: ${numberOfScannedPages}`)
            try {

                await this.goToNextPage()

            } catch (error) {
                console.log('There is no more pages.')
                break;
            }

            if (!hasNextPage) {
                break;
            }

            hasNextPage = await this.hasNextPage();

            numberOfScannedPages++;
        }
        console.log(products);
        return products;

    }


}