import skipCommand from "./music/skip.command";

require('dotenv').config()
import {Client, Interaction} from 'discord.js';
import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import fs from "node:fs";
import path from "node:path";
import playCommand from "./music/play.command";
import statusCommand from "./music/status.command";
import leaveCommand from "./music/leave.command";
import queueCommand from "./music/queue.command";
import testCommand from "./music/test.command";
import pauseCommand from "./music/pause.command";
import resumeCommand from "./music/resume.command";
export const bootstrap = async (client: Client) => {
    await registerGlobalCommand()
        .catch(err => console.log(err));

    await interactionCreate(client)
        .catch(err => console.log(err));
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
    const commandsPath = path.join(__dirname + '/music');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file
        .endsWith('.command.ts'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        commands.push(command.default.data.toJSON());
    }
    console.log(commands)
    return commands;
}

const interactionCreate = async (client: Client) => {
    client.on('interactionCreate', async (interaction: Interaction) => {
        if (!interaction.isCommand()) {
            return;
        }

        try {
            switch (interaction.commandName) {
                case playCommand.data.name:
                    await playCommand.execute(interaction);
                    break;
                case statusCommand.data.name:
                    await statusCommand.execute(interaction);
                    break;
                case leaveCommand.data.name:
                    await leaveCommand.execute(interaction);
                    break;
                case queueCommand.data.name:
                    await queueCommand.execute(interaction);
                    break;
                case skipCommand.data.name:
                    await skipCommand.execute(interaction);
                    break;
                case testCommand.data.name:
                    await testCommand.execute(interaction);
                    break;
                case pauseCommand.data.name:
                    await pauseCommand.execute(interaction);
                    break;
                case resumeCommand.data.name:
                    await resumeCommand.execute(interaction);
                    break;
            }
        } catch (e: any) {
            console.log(e.toString(), 'deploy.js - command error');
            await interaction.editReply(e.toString());
        }
    })
}
