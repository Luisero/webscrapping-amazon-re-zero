import puppeteer from "puppeteer";

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    });

    const page = await browser.newPage();

    await page.setViewport({
        width: 1920,
        height: 1080
    });

    let url = 'https://www.amazon.com.br/s?k=re+zero&__mk_pt_BR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1GU6IIMG4M272&sprefix=re+zero%2Caps%2C163&ref=nb_sb_noss_1'

    await page.goto(url);

    await page.screenshot({
        path: 're-zero.png'
    });


    const productHandles = await page.$$('.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item');

    for (const productHandle of productHandles) {
        try {
            const title = await page.evaluate((el)=>el.querySelector('h2 > a > span')?.textContent, productHandle)
            
            const price = await page.evaluate((el)=> el.querySelector('.a-price span[aria-hidden="true"]')?.textContent, productHandle);

            console.log(`${title} - ${price}`);
        } catch (error) {
          
        }
    }
})();