const fs = require('fs');
const path = require('path');

const puppeteer = require('puppeteer');

const yaml = require('js-yaml');

const NEXT_BUTTON_SELECTOR = '.links .link-sectionmore:not(.sectionprevious)';

(async() => {
    let all_elements = [];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://fivethirtyeight.com/tag/the-riddler/');
    console.log('https://fivethirtyeight.com/tag/the-riddler/');

    let next_button;
    
    while (next_button = await page.$(NEXT_BUTTON_SELECTOR)) {
        let current_elements = await page.$$eval('.post-info', posts => {
            let elements_array = [];
            posts.forEach(p => {
                let date = p.querySelector('.datetime').getAttribute('title');
                let link = p.querySelector('.article-title a');
                let href = link.getAttribute('href');
                let title = link.innerText;

                elements_array.push({ date, href, title });
            });

            return elements_array;
        });

        all_elements = all_elements.concat(current_elements);
        
        let next_url = await page.evaluate(button => button.getAttribute('href'), next_button);

        console.log(next_url);
        await page.goto(next_url, {waitUntil: 'domcontentloaded'});
    }

    // Final page does not have a 'next' button, but still has some posts
    let current_elements = await page.$$eval('.post-info', posts => {
        let elements_array = [];
        posts.forEach(p => {
            let date = p.querySelector('.datetime').getAttribute('title');
            let link = p.querySelector('.article-title a');
            let href = link.getAttribute('href');
            let title = link.innerText;

            elements_array.push({ date, href, title });
        });

        return elements_array;
    });

    all_elements = all_elements.concat(current_elements);

    let results_yaml = fs.writeFileSync('./riddler-result.yml', yaml.dump(all_elements, {lineWidth:9999}));
    console.log('Written to riddler-result.yml');

    await browser.close();
})();

