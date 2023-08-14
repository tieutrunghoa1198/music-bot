import puppeteer, {Browser, HTTPRequest, Page} from "puppeteer";
import {soundCloudUrl} from "scdl-core/dist/constants/configs";
import play from "play-dl";

export default class PuppeteerIntercept {
    private browser: Browser | undefined;
    private page: Page | undefined;
    constructor() {
        this.initialize().then();
    }

    private findToken(request: HTTPRequest): void {
        const url = request.url();
        if (url.includes('client_id')) {
            play.setToken({
                soundcloud: {
                    client_id: url.split('client_id=')[1]
                }
            })
        }
        console.log(url)
        request.continue();
    }

    // private setClientId(url: string): string {
    //     return '';
    // }
    //
    // private findClientId(url: string): string {
    //     console.log('Intercept', url);
    //     return '';
    // }

    private async initialize() {
        this.browser = await puppeteer.launch();
        this.page = await this.browser.newPage();
        await this.setIntercept(this.page, true);
    }

    public async updateToken() {
        await this.onRequest(this.findToken);
        await this.sendRequest(soundCloudUrl);
    }

    private async setIntercept(page: Page, value: boolean) {
        await page.setRequestInterception(value)
    }
    public call() {
        console.log('asd')
    }
    public async onRequest(handler: (request: HTTPRequest) => void) {
        this.page?.on(
            'request',
            (request) => handler(request)
        );
    }

    public async sendRequest(url: string) {
        try {
            await this.page?.goto(url);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            await this.browser?.close();
        }
    }
}
