import {config} from "dotenv";
import {Client, Intents} from "discord.js";
import {bootstrap} from "./commands/deploy";
import {SoundCloud} from "scdl-core";
import {MessageHandler} from "./messages";
import mongoose from 'mongoose';
import MongoDB from './utils/mongodb';
import {ActivityTypes} from "discord.js/typings/enums";
import {Command} from "./constants/command";

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
    client?.user?.setActivity(`with ${Command.play.name}`, { type: ActivityTypes.PLAYING })
});

client.login(process.env.TOKEN).then(async () => {
    await SoundCloud.connect();
    await bootstrap(client);
    await MessageHandler.handle(client);
});

process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});

