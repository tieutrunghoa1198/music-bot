require('dotenv').config()
import {Client, Interaction} from 'discord.js';
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
    if (!myCmd.length) {
        console.log('command array is empty -> cannot read')
    }
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
                    await nextButton.execute(interaction, client);
                    break;
                case previousButton.customId:
                    await previousButton.execute(interaction, client);
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
            if (!myCommand.length) throw new Error();
            for (const command of myCommand) {
                if (command.data.name === interaction.commandName) {
                    await command.execute(interaction, client);
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
        const currentFolderPath = path.join(__dirname + '/' + folder);
        const folderFiles = fs.readdirSync(currentFolderPath);
        folderFiles.filter(e => {
            if (!e.includes(cmdFileExt)) {
                return;
            }
            const filePath = path.join(currentFolderPath + '/' + e);
            const module = require(filePath);
            myCommand.push(module.default);
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
