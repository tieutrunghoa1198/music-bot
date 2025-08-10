import { logger } from './core/utils/logger.util';

require('module-alias/register');
import { Bot } from './app';

Bot.getInstance().start();
process.on('uncaughtException', function (err) {
  logger.error(err + ' | common at audio-player.module.ts');
  logger.info('Node NOT Exiting...');
  return;
});
