import messages from "../../constants/messages";

require('dotenv').config()
import {Client} from 'discord.js';
import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import fs from "node:fs";
import path from "node:path";
import nextButton from "../ui/response/music/next.button";
import previousButton from "../ui/response/music/previous.button";
import {TrackSelectMenu} from "../ui/response/music/track.selectmenu";
import {RecordSelectMenu} from "../ui/response/music/record.selectmenu";
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

const isUserInvoiceChannel = async (interaction: any): Promise<boolean> => {
    const voiceChannel = interaction.member.voice.channel;
    const folderName = 'music';
    const folderPath = path.join(__dirname, folderName);
    const files = fs.readdirSync(folderPath);
    let result = true;
    files.forEach((file: any) => {
        const filePath = path.join(folderPath, file)
        const command = require(filePath);
        const commandName = command.default.data.name;
        if (commandName === interaction.commandName) {
            if (voiceChannel === null || voiceChannel === undefined) {
                result = false;
            }
        }
    })
    return result;
}

const ephemeralResponse = async (interaction: any, message: string) => {
    await interaction.followUp({
        content: message,
        ephemeral: true
    });
}

const interactionCreate = async (client: Client) => {
    client.on('interactionCreate', async (interaction: any) => {
        if (interaction.isCommand()) {
            await interaction.deferReply();
            const condition = await isUserInvoiceChannel(interaction);
            if (!condition) {
                await interaction.followUp(messages.userJoinVoiceChannel(interaction.user.toString()));
                return;
            }
            try {
                const myCommand: any[] = extractCommands();
                if (!myCommand.length) throw new Error();
                for (const command of myCommand) {
                    if (command.data.name === interaction.commandName) {
                        await command.execute(interaction, client);
                    }
                }
            } catch (e: any) {
                console.log(e.toString(), 'deploy.js - command error');
                if (interaction.deletable) {
                    await interaction.followUp(e.toString());
                }
            }
        }

        if (interaction.isSelectMenu()) {
            await interaction.deferUpdate();
            try {
                const condition = interaction.member.voice.channel;
                if (!condition) {
                    await ephemeralResponse(interaction, messages.userJoinVoiceChannel(interaction.user.toString()))
                    return;
                }
                await TrackSelectMenu.interaction(interaction, client);
                await RecordSelectMenu.interaction(interaction, client);
            } catch (e) {
                console.log(e);
                await interaction.followUp(messages.error + ': Select menu track!');
            }
        }

        if (interaction.isButton()) {
            await interaction.deferUpdate();
            try {
                const condition = interaction.member.voice.channel;
                if (!condition) {
                    await ephemeralResponse(interaction, messages.userJoinVoiceChannel(interaction.user.toString()))
                    return;
                }
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
                await interaction.followUp(messages.error + 'interaction Button error');
            }
        }
    })
}

const extractCommands = (): any[] => {
    const allFeatures = fs.readdirSync(__dirname);
    let myCommand: any[] = [];
    const {fileExt, cmdFileExt} = getCommandFileExt();
    allFeatures.forEach((folder: string) => {
        if (folder.includes(fileExt)) {
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

const getCommandFileExt = () => {
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
