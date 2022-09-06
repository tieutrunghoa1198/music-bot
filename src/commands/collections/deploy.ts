import pingCommand from "./ping.command";
require('dotenv').config()
import {Client, Interaction} from 'discord.js';
import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import fs from "node:fs";
import path from "node:path";
import pongCommand from "./pong.command";
import connectCommand from "./connect.command";

export const bootstrap = async (client: Client) => {
    await registerGlobalCommand()
        .catch(err => console.log(err));

    await interactionCreate(client)
        .catch(err => console.log(err))
};

const registerGlobalCommand = async () => {
    const token: any = process.env.TOKEN;
    const clientId: any = process.env.clientId;
    const commands = getAllCommands();

    const rest =  new REST({ version: '9' }).setToken(token);
    await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
    )
}

const getAllCommands = (): any[] => {
    const commands: any = [];
    const commandsPath = path.join(__dirname);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.command.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        commands.push(command.default.data.toJSON());
    }

    return commands;
}

const interactionCreate = async (client: Client) => {
    client.on('interactionCreate', async (interaction: Interaction) => {
        if (!interaction.isCommand()) {
            return;
        }

        try {
            switch (interaction.commandName) {
                case pingCommand.data.name:
                    await pingCommand.execute(interaction);
                    break;
                case pongCommand.data.name:
                    await pongCommand.execute(interaction);
                    break;
                case connectCommand.data.name:
                    await connectCommand.execute(interaction);
                    break;
            }
        } catch (e: any) {
            await interaction.reply(e.toString());
        }
    })
}
