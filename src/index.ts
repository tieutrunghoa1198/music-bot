import {logger} from "./core/utils/logger.util";

require('module-alias/register');
import { Bot } from './bot-application';

Bot.getInstance().start();
process.on('uncaughtException', function (err) {
  logger.error(err);
  logger.info('Node NOT Exiting...');
  return;
});
