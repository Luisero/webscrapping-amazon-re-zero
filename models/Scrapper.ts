import { Browser, ElementHandle, Page } from "puppeteer";
import { Product } from "./Product";
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

        console.log('fdjflkj')

        await this.page.setViewport({
            width: 1920,
            height: 1080
        });



        await this.page.goto(this.url);

        await this.page.screenshot({
            path: 're-zero.png'
        });


        const products: Product[] = await this.getProductsInfos();
        console.log(products)
        products.forEach((product: Product)=>{
            console.log(`${product.title} -  ${product.price}`);
        })


        await this.browser.close();
    }

    parseFormatedPriceToFloat(formatedPrice: string | null | undefined): number{
        if(formatedPrice === null || formatedPrice === undefined) return 0;

        const price = Number.parseFloat(formatedPrice.replace('R$','').replace(',','.'));

        return price;
    }

    /**
     * getProductContainer
     */
    async getProductContainer(query: string) {
        const productHandles = await this.page.$$(query);
        return productHandles;
    }
    async getProductTitle(productHandle:ElementHandle<Element>): Promise<string>{
        const title = await this.page.evaluate((el) => el.querySelector('h2 > a > span')?.textContent, productHandle)

        if(title === null || title === undefined) return "";

        return title;
    }


    async getProductPrice(productHandle: ElementHandle<Element>): Promise<number>{
        const formatedPrice = await this.page.evaluate((el) => el.querySelector('.a-price span[aria-hidden="true"]')?.textContent, productHandle);

        const price = this.parseFormatedPriceToFloat(formatedPrice);

        return price;
    }

    async getProductsInfos(){
        let products: Product[] = [];

        const productHandles = await this.getProductContainer('.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item');

        for (const productHandle of productHandles) {
            try {
                const title: string = await this.getProductTitle(productHandle);
                const price = await this.getProductPrice(productHandle);

                const description = '';

                let product = new Product(title, price, description);

                
                products.push(product);
                console.log(products)
            } catch (error) {
                console.log(error)
            }
        }

        return products;
    }


}