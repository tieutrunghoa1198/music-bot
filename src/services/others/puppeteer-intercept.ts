import puppeteer, {Browser, HTTPRequest, Page} from "puppeteer";

export default class PuppeteerIntercept {
    private browser: Browser | undefined;
    private page: Page | undefined;
    constructor() {
        this.initialize().then();
    }

    private async initialize() {
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
        await this.setIntercept(this.page, true);
    }

    private async setIntercept(page: Page, value: boolean) {
        await page.setRequestInterception(value)
    }
    public call() {
        console.log('asd')
    }
    public async onRequest(handler: (request: HTTPRequest) => void) {
        this.page?.on('request', handler);
    }

    public async sendRequest(url: string) {
        console.log(url)
        try {
            await this.page?.goto(url);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            await this.browser?.close();
        }
    }
}
