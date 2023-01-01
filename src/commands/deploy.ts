require('dotenv').config()
import {Client, Interaction, Message} from 'discord.js';
import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import fs from "node:fs";
import path from "node:path";
import nextButton from "./music/buttons/musicQueue/next.button";
import previousButton from "./music/buttons/musicQueue/previous.button";
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
    let commands: any = [];
    const myCmd = extractCommands();
    myCmd.forEach(command => {
        commands.push(command.data.toJSON())
    })
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
            const myCommand: any[] = extractCommands();
            for (const command of myCommand) {
                if (command.data.name === interaction.commandName) {
                    await command.execute(interaction);
                    return;
                }
            }
        } catch (e: any) {
            console.log(e.toString(), 'deploy.js - command error');
            await interaction.followUp(e.toString());
        }
    })
}

const extractCommands = (): any[] => {
    const allFeatures = fs.readdirSync(__dirname);
    let myCommand: any[] = [];
    const {fileExt, cmdFileExt} = getFileExt();
    allFeatures.forEach((folder: string) => {
        if (folder.includes(fileExt)) {
            //ignore deploy.ts/js
            return;
        }
        const folderFiles = fs.readdirSync(__dirname + '/' + folder)
        const currentPath = path.join(__dirname + '/' + folder);

        folderFiles.filter(e => {
            if (!e.includes(cmdFileExt)) {
                return;
            }
            myCommand.push(require(path.join(currentPath + '/' + e)).default)
        });
    })
    return myCommand;
}

const getFileExt = () => {
    const cmdExt: string = '.command';
    let cmdFileExt: string;
    let fileExt: string;
    if (process.env.NODE_ENV === 'production') {
        fileExt = '.js'
        cmdFileExt = cmdExt + fileExt;
    } else {
        fileExt = '.ts'
        cmdFileExt = cmdExt + fileExt;
    }
    return {
        fileExt,
        cmdFileExt
    }
}
