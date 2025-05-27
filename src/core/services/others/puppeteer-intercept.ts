import puppeteer from 'puppeteer';
import play from 'play-dl';
import {logger} from "@/core/utils/logger.util";

export default class PuppeteerIntercept {

  public static async setSoundCloudToken() {
    await this.initialize();
  }

  private static async initialize() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setRequestInterception(true);

    const handler = async (req: any) => {
      try {
        const url = req.url();

        req.continue();

        if (url.includes('/oauth/session?client_id=')) {

          const token = url.split('/oauth/session?client_id=')[1];
          this.updateToken(token);

          logger.info('🎯 Found the request. Removing handler.');
          page.off('request', handler);          // stop listening

          await page.setRequestInterception(false);

        }
      } catch (e) {
        logger.error('Error on close connection.Z');
      }
    };

    page.on('request', handler);

    await page.goto('https://soundcloud.com');
    await browser.close();
  }

  private static updateToken(token: string) {
    play.setToken({
      soundcloud: { client_id: token },
    });
  }
}
