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
    const commands: any = [];
    const commandsFolder = path.join(__dirname);
    const cmdExt: string = '.command';
    let fileExt: string;
    if (process.env.NODE_ENV === 'production') {
        fileExt = '.js'
        fileExt = cmdExt + '.js';
    } else {
        fileExt = cmdExt + '.ts';
        fileExt = '.ts'
    }
    fs.readdirSync(commandsFolder).forEach((folder: string) => {
        if (folder.includes(fileExt)) {
            //ignore deploy.ts/js
            return;
        }

        const currentPath = path.join(__dirname + '/' + folder);
        const folderFiles = fs.readdirSync(currentPath)
        folderFiles.filter(e => {
            if (!e.includes(fileExt)) {
                return;
            }
            const filePath = path.join(currentPath + '/' + e);
            const command = require(filePath);
            commands.push(command.default.data.toJSON())
        });
    })
    console.log(commands)
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
        const cmdExt: string = '.command';
        let fileExt: string;
        if (process.env.NODE_ENV === 'production') {
            fileExt = '.js'
            fileExt = cmdExt + '.js';
        } else {
            fileExt = cmdExt + '.ts';
            fileExt = '.ts'
        }
        try {
            const allFeatures = fs.readdirSync(__dirname);
            let myCommand: any[] = [];
            allFeatures.forEach((folder: string) => {
                if (folder.includes(fileExt)) {
                    //ignore deploy.ts/js
                    return;
                }
                const folderFiles = fs.readdirSync(__dirname + '/' + folder)
                const currentPath = path.join(__dirname + '/' + folder);

                folderFiles.filter(e => {
                    if (!e.includes(fileExt)) {
                        return;
                    }
                    myCommand.push(require(path.join(currentPath + '/' + e)).default)
                    return require(path.join(currentPath + '/' + e));
                });
            })
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
