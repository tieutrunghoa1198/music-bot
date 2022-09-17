import { config } from "dotenv";

config();

import { Client, Intents } from "discord.js";
import {bootstrap} from "./commands/deploy";
import {SoundCloud} from "scdl-core";
import express, { Request, Response } from "express";
import WebSocket from "ws";
import { createServer } from "http";
import path from "path";

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

process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});

const server = createServer(app);
const wss = new WebSocket.Server({ server });
wss.on('connection', function (ws) {
    const id = setInterval(function () {
        ws.send(JSON.stringify(process.memoryUsage()), function () {
            //
            // Ignore errors.
            //
        });
    }, 100);
    console.log('started client interval');

    ws.on('close', function () {
        console.log('stopping client interval');
        clearInterval(id);
    });
});
