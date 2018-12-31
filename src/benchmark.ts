import * as puppeteer from "puppeteer";

export function benchmark(title: string, ...functions: Array<() => any>) {
    describe(`benchmark ${title}`, async () => {
        let browser: puppeteer.Browser;
        let page: puppeteer.Page;
        before(async () => browser = await puppeteer.launch({ headless: !process.env.CHROME_HEADLESS_DISABLE }));
        after(() => browser.close());
        beforeEach(async () => page = (await browser.pages())[ 0 ] || await browser.newPage());
        afterEach(() => page.close({ runBeforeUnload: false }));

        functions.forEach((fn) => it(fn.name, async () => {
            const result = await page.evaluate(fn);
            if (!!result) {
                console.log(result);
            }
        }).timeout(10000));
    });
}
