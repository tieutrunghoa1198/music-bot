import puppeteer, {HTTPRequest} from 'puppeteer';
import play from 'play-dl';

export default class PuppeteerIntercept {

  public static async setSoundCloudToken() {
    await this.initialize();
  }

  private static async initialize() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (interceptedRequest: HTTPRequest) => {
      const url = interceptedRequest.url();

      if (interceptedRequest.isInterceptResolutionHandled()) return;
      if (url.includes('/oauth/session?client_id=')) {
        const token = url.split('/oauth/session?client_id=')[1];
        this.updateToken(token);
        return;
      }

      interceptedRequest.continue();
    });
    await page.goto('https://soundcloud.com', {
      waitUntil: ['domcontentloaded', 'networkidle2'],
      timeout: 3000000
    });
    await browser.close();
  }

  private static updateToken(token: string) {
    play.setToken({
      soundcloud: { client_id: token },
    });
  }
}
