import {Client, Intents, TextChannel} from "discord.js";
import {SoundCloud} from "scdl-core";
import {config} from "dotenv";
import {MusicCommands} from "../constants/musicCommands";
import {ActivityTypes} from "discord.js/typings/enums";
import * as Struct from './index';
import {MusicAreas} from "../mongodb/music-area.model";
import messages from "../constants/messages";
import MongoDB from "../utils/mongodb";
import mongoose from "mongoose";
config()
export class Bot {
    private readonly client: Client;
    constructor() {
        this.client = new Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_VOICE_STATES,
                Intents.FLAGS.GUILD_INTEGRATIONS,
            ],
        });
    }

    start() {
        this.client.login(process.env.TOKEN).then(async () => {
            await SoundCloud.connect();
            await this.deployCommand();
        });

        this.client.on("ready", async () => {
            this.client?.user?.setActivity(
                `with /${MusicCommands.play.name}`,
                { type: ActivityTypes.PLAYING });
            await this.loadMongoDb();
            await this.loadCommand();
            await this.loadMessage();
        });

        this.client.on('nextSong', async (payload) => {
            if (!payload.nextSong?.song) {
                console.log('Out of Queue');
                return;
            }
            const guildId = payload.guildId;
            try {
                await MusicAreas
                    .findOne(
                        {guildId: guildId},
                        async (err: any, musicAreaChannel: any) => {
                            if (musicAreaChannel === null || musicAreaChannel === undefined) {
                                console.log('not found music area in this guild')
                                return;
                            }
                            const {textChannelId} = musicAreaChannel;
                            if (textChannelId !== '' &&
                                textChannelId) {
                                const textChannel = await this.client.channels.cache.get(textChannelId) as TextChannel;
                                await textChannel.send(messages.skippedSong({
                                    title: payload.nextSong.song.title,
                                    requester: payload.nextSong.requester
                                }));
                            }
                        }).clone()
            } catch (e) {
                console.log(e);
            }
        })
    }

    async loadCommand() {
        try {
            await Struct.InteractionCreate(this.client)
        } catch (e) {
            console.log(e);
        }
    }

    async loadMessage() {
        try {
            await Struct.MessageCreate(this.client)
        } catch (e) {
            console.log(e);
        }
    }

    async deployCommand() {
        try {
            await Struct.bootstrapCommand();
        } catch (e) {
            console.log(e);
        }
    }

    async loadMongoDb() {
        try {
            MongoDB.dbConnect(mongoose);
        } catch (e) {
            console.log(e)
        }
    }

}
