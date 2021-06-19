const path = require('./temp')

const puppeteer = require('puppeteer');
// looking for div with class="card-body ingredient-desc"

async function startBrowser(){
    let browser;
    try {
        console.log("Instance created");
        browser = await puppeteer.launch({
            headless: true,
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
}

(
    async function scrape(){
        // webpage details



        const browser = await startBrowser();

        console.log('start new page')
        const page = await browser.newPage();
        console.log('goto page')
        await page.goto(path);

        console.log('wait for card')
        await page.waitForSelector('.card');
        console.log('done waiting for card')


        let ingredientNames = await page.evaluate(()=>{
            console.log('evaluated page')

            let results = []
            let ingredientElems =  document.querySelectorAll("div.ingredient-desc")

            ingredientElems.forEach((x)=>{
                // const ingredientName = x.firstElementChild.innerText;
                const ingredientName = x.children;


                results.push({
                  name : ingredientName[0].innerText,
                  description : ingredientName[1].innerText
                });
            })
            return results})

        console.log('pages has been scraped')
        console.log(ingredientNames)

        


    await browser.close();
    }
)();