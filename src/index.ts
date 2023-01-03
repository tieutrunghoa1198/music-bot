import {config} from "dotenv";
import {Client, Intents, TextChannel} from "discord.js";
import {bootstrap} from "./commands/deploy";
import {SoundCloud} from "scdl-core";
import {MessageController} from "./messages";
import mongoose from 'mongoose';
import MongoDB from './utils/mongodb';
import {ActivityTypes} from "discord.js/typings/enums";
import {Command} from "./constants/command";
import play from "play-dl";
import fs from "node:fs";
import path from "node:path";
import {SelectMenuController} from "./selectmenu-response-controller";
import {MusicAreas} from "./mongodb/music-area.model";
import messages from "./constants/messages";

config();
MongoDB.dbConnect(mongoose);

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_INTEGRATIONS,
    ],
});
client.on("ready", () => {
    console.log(`> Bot is on ready`);
    client?.user?.setActivity(`with /${Command.play.name}`, { type: ActivityTypes.PLAYING })
});

client.login(process.env.TOKEN).then(async () => {
    await SoundCloud.connect();
    await bootstrap(client);
    await MessageController.handle(client);
    await SelectMenuController.handle(client);
});

client.on('nextSong', async (payload) => {
    if (!payload.nextSong?.song) {
        console.log('Out of Queue');
        return;
    }
    const guildId = payload.guildId;
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
                    const textChannel = await client.channels.cache.get(textChannelId) as TextChannel;
                    await textChannel.send(messages.skippedSong({
                        title: payload.nextSong.song.title,
                        requester: payload.nextSong.requester
                    }));
                }
            }).clone()
})

process.on('uncaughtException', function (err) {
    const patha = path.join(__dirname, '..', '.data/spotify.data');
    const folder = fs.readFileSync(patha).toString();
    const jsonFolder = JSON.parse(folder);
    play.setToken({
        spotify: {
            client_id: jsonFolder.client_id,
            client_secret: jsonFolder.client_secret,
            refresh_token: jsonFolder.refresh_token,
            market: jsonFolder.market
        }
    }).then(r => {
        console.log(r, 'after set token')
    })
    console.error(err);
    console.log("Node NOT Exiting...");
    return;
});

