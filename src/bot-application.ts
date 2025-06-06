import {SoundCloud} from 'scdl-core';
import {config} from 'dotenv';
import MongoDB from '@/core/utils/mongodb.util';
import mongoose from 'mongoose';
import {deployCommandUtil} from '@/core/utils/deploy-command.util';
import {botClient} from '@/bot-client';
import {EventsRouter} from '@/features/audio-player/events.router';
import {InteractionHandler} from "@/core/services/interaction.service";
import {logger} from "@/core/utils/logger.util";
import {players} from "@/core/constants/common.constant";

config();
export class Bot {
  private static instance: Bot;

  //-------------------------------------------

  public static getInstance(): Bot {
    if (!Bot.instance) Bot.instance = new Bot();

    return Bot.instance;
  }

  //-------------------------------------------

  async start() {
    await SoundCloud.connect();
    MongoDB.dbConnect(mongoose);
    deployCommandUtil();

    botClient.login(process.env.TOKEN).then();
    botClient.on('ready',() => {
      logger.info('Bot client has started');
    });

    this.bootstrap();
  }

  private bootstrap() {
    EventsRouter();
    new InteractionHandler();
  }
}
