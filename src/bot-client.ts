import { Client, Intents, TextChannel } from 'discord.js';
import { SoundCloud } from 'scdl-core';
import { config } from 'dotenv';
import { MusicAreas } from '@/core/mongodb/music-area.model';
import MongoDB from '@/core/utils/mongodb.util';
import mongoose from 'mongoose';
import { Messages } from '@/core/constants/index.constant';
import { InteractionCreate } from '@/features/interaction-create';
import { MessageCreate } from '@/features/message-create';
import { deployCommandUtil } from '@/core/utils/deploy-command.util';
import { logger } from '@/core/utils/logger.util';

config();
export class Bot {
  private static instance: Bot;
  private readonly client: Client;

  //-------------------------------------------

  private constructor() {
    this.client = botClient;
  }

  public static getInstance(): Bot {
    if (!Bot.instance) Bot.instance = new Bot();

    return Bot.instance;
  }

  //-------------------------------------------

  start() {
    this.client.login(process.env.TOKEN).then(async () => {
      await SoundCloud.connect();
      deployCommandUtil();
    });

    this.client.on('ready', async () => {
      await this.loadMongoDb();
      await this.loadCommand();
      await this.loadMessage();
    });

    this.client.on(
      'nextSong',
      async (payload) => await this.onNextSong(payload),
    );
  }

  async loadCommand() {
    try {
      await InteractionCreate();
    } catch (e) {
      console.log(e);
    }
  }

  async loadMessage() {
    try {
      await MessageCreate();
    } catch (e) {
      logger.error(e);
    }
  }

  async loadMongoDb() {
    try {
      MongoDB.dbConnect(mongoose);
    } catch (e) {
      console.log(e);
    }
  }

  async onNextSong(payload: any) {
    const guildId = payload.guildId;
    if (!payload.nextSong?.song) return;

    try {
      const query = MusicAreas.where({ guildId: guildId });
      const musicAreaChannel = await query.findOne();
      if (musicAreaChannel === null || musicAreaChannel === undefined) {
        console.log('not found music area in this guild');
        return;
      }
      const { textChannelId } = musicAreaChannel;
      if (textChannelId !== '' && textChannelId) {
        const textChannel = this.client.channels.cache.get(
          textChannelId,
        ) as TextChannel;
        await textChannel.send(
          Messages.skippedSong({
            title: payload.nextSong.song.title,
            requester: payload.nextSong.requester,
          }),
        );
      }
    } catch (e) {
      console.log(e);
    }
  }
}

export const botClient = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_INTEGRATIONS,
  ],
});
