import {config} from "dotenv";
import {Client, Intents} from "discord.js";
import {bootstrap} from "./commands/deploy";
import {SoundCloud} from "scdl-core";
import {MessageHandler} from "./messages";
import mongoose from 'mongoose';
import MongoDB from './utils/mongodb';
import {ActivityTypes} from "discord.js/typings/enums";
import {Command} from "./constants/command";
import play from "play-dl";
import fs from "node:fs";
import {request} from "express";
import path from "node:path";

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
    await MessageHandler.handle(client);
});

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
});

