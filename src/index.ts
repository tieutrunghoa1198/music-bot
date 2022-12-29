import { config } from "dotenv";

config();

import { Client, Intents } from "discord.js";
import {bootstrap} from "./commands/deploy";
import {SoundCloud} from "scdl-core";

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
});

client.login(process.env.TOKEN).then(async () => {
    await SoundCloud.connect();
    await bootstrap(client);
});

process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});

