import {Client, Intents, TextChannel} from 'discord.js';
import {SoundCloud} from 'scdl-core';
import {config} from 'dotenv';
import {MusicAreas} from '@/core/mongodb/music-area.model';
import MongoDB from '@/core/utils/mongodb.util';
import mongoose from 'mongoose';
import {HandleAudioInteraction} from '@/features/audio-player/handle-audio-interaction';
import {Messages} from '@/core/constants/index.constant';

import {players} from '@/core/models/abstract-player.model';
import {InteractionCreate} from '@/features/interaction-create';
import {MessageCreate} from '@/features/message-create';

config();
export class Bot {
  private static instance: Bot;
  private readonly client: Client;

  //-------------------------------------------

  private constructor() {
    this.client = new Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_INTEGRATIONS,
      ],
    });
  }

  public static getInstance(): Bot {
    if (!Bot.instance) Bot.instance = new Bot();

    return Bot.instance;
  }

  //-------------------------------------------

  start() {
    this.client.login(process.env.TOKEN).then(async () => {
      await SoundCloud.connect();
      await this.deployCommand();
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
      await InteractionCreate(this.client);
    } catch (e) {
      console.log(e);
    }
  }

  async loadMessage() {
    try {
      await MessageCreate(this.client);
    } catch (e) {
      console.log(e);
    }
  }

  async deployCommand() {
    try {
      await HandleAudioInteraction.registerGlobalCommand();
    } catch (e) {
      console.log(e);
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
    const player = players.get(guildId as string);
    if (!payload.nextSong?.song) {
      console.log('Out of Queue');
      if (player) player.replaceMessage().then();
      return;
    }

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
