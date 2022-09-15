import { config } from "dotenv";

config();

import { Client, Intents } from "discord.js";
import {bootstrap} from "./commands/deploy";
import {SoundCloud} from "scdl-core";
import express, { Request, Response } from "express";
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

const app = express();

app.get('/', (_req: Request, res: Response) => {
    return res.send({
        message: 'Bot is running',
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`> Bot is on listening`);
    // herokuAwake(process.env.APP_URL || 'http://localhost:3000');
});
