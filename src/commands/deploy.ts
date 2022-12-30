import skipCommand from "./music/skip.command";

require('dotenv').config()
import {Client, Interaction, Message} from 'discord.js';
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
import nextButton from "./music/buttons/musicQueue/next.button";
import previousButton from "./music/buttons/musicQueue/previous.button";
import setMusicAreaCommand from "./music/setMusicArea.command";
export const bootstrap = async (client: Client) => {
    await registerGlobalCommand()
        .catch(err => console.log(err));

    await interactionCreate(client)
        .catch(err => console.log(err));

    await interactionButton(client)
        .catch((err) => console.log(err));
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
    let fileExt: string;
    if (process.env.NODE_ENV === 'production') {
        fileExt = '.command.js';
    } else {
        fileExt = '.command.ts';
    }

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file
        .endsWith(fileExt));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        commands.push(command.default.data.toJSON());
    }
    return commands;
}

const interactionButton = async (client: Client) => {
    client.on('interactionCreate', async (interaction: Interaction) => {
        if (!interaction.isButton()) return;

        try {
            switch (interaction.customId) {
                case nextButton.customId:
                    await nextButton.execute(interaction);
                    break;
                case previousButton.customId:
                    await previousButton.execute(interaction)
                    break;
            }
        } catch (e) {
            console.log(e, 'interaction Button error');
        }
    })
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
                case setMusicAreaCommand.data.name:
                    await setMusicAreaCommand.execute(interaction);
                    break;
            }
        } catch (e: any) {
            console.log(e.toString(), 'deploy.js - command error');
            await interaction.followUp(e.toString());
        }
    })
}
