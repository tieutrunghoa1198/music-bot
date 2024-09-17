import { SoundCloud } from 'scdl-core';
import { config } from 'dotenv';
import MongoDB from '@/core/utils/mongodb.util';
import mongoose from 'mongoose';
import { deployCommandUtil } from '@/core/utils/deploy-command.util';
import { botClient } from '@/bot-client';
import { AudioPlayerModule } from '@/features/audio-player/audio-player.module';
import { ModeratingMessageModule } from '@/features/moderating-message/moderating-message.module';

config();
export class Bot {
  private static instance: Bot;

  //-------------------------------------------

  public static getInstance(): Bot {
    if (!Bot.instance) Bot.instance = new Bot();

    return Bot.instance;
  }

  //-------------------------------------------

  start() {
    botClient.login(process.env.TOKEN).then(async () => {
      await SoundCloud.connect();
      deployCommandUtil();
    });

    botClient.on('ready', async () => {
      MongoDB.dbConnect(mongoose);
    });

    this.bootstrap();
  }

  private bootstrap() {
    ModeratingMessageModule();
    AudioPlayerModule();
  }
}
