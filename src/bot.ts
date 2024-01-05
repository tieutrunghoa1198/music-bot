import {Client, Intents, TextChannel} from "discord.js";
import {SoundCloud} from "scdl-core";
import {config} from "dotenv";
import {ActivityTypes} from "discord.js/typings/enums";
import {MusicAreas} from "./mongodb/music-area.model";
import MongoDB from "./utils/mongodb";
import mongoose from "mongoose";
import {HandleInteraction} from "./controllers/command/handleInteraction";
import {Messages, MusicCommands} from "./constants/index.constant";
import {InteractionCreate, MessageCreate} from "./controllers";
import {players} from "./models/abstract-player.model";

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

        this.client.on('nextSong', async (payload) => await this.onNextSong(payload))
    }

    async loadCommand() {
        try {
            await InteractionCreate(this.client)
        } catch (e) {
            console.log(e);
        }
    }

    async loadMessage() {
        try {
            await MessageCreate(this.client)
        } catch (e) {
            console.log(e);
        }
    }

    async deployCommand() {
        try {
            await HandleInteraction.registerGlobalCommand();
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

    async onNextSong(payload: any) {
        const guildId = payload.guildId;
        const player = players.get(guildId as string);
        if (!payload.nextSong?.song) {
            console.log('Out of Queue');
            if (player) player.replaceMessage().then();
            return;
        }

        try {
            const query = MusicAreas.where({guildId: guildId});
            const musicAreaChannel = await query.findOne();
            if (musicAreaChannel === null || musicAreaChannel === undefined) {
                console.log('not found music area in this guild')
                return;
            }
            const {textChannelId} = musicAreaChannel;
            if (textChannelId !== '' &&
                textChannelId) {
                const textChannel = await this.client.channels.cache.get(textChannelId) as TextChannel;
                await textChannel.send(Messages.skippedSong({
                    title: payload.nextSong.song.title,
                    requester: payload.nextSong.requester
                }));
            }
        } catch (e) {
            console.log(e);
        }
    }
}
