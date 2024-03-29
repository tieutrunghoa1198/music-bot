import {Client} from "discord.js";
import path from "node:path";
import fs from "node:fs";
import {DeployCommands} from "@/core/utils/deploy-commands.util";
import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import {Messages} from "@/core/constants/messages.constant";

export class HandleInteraction {

    public static registerGlobalCommand = async () => {
        const token: any = process.env.TOKEN;
        const clientId: any = process.env.clientId;
        const commands = this.getAllCommands();
        const rest =  new REST({ version: '9' }).setToken(token);
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        )
    }

    private static getAllCommands = (): any[] => {
        let commands: any = [];
        const myCmd = DeployCommands.extractCommands(__dirname, '.command');
        if (!myCmd.length) {
            console.log('command array is empty -> cannot read')
        }
        myCmd.forEach(command => {
            commands.push(command.data.toJSON())
        })
        return commands;
    }

    public static async slashCommand(interaction: any, client: Client) {
        await interaction.deferReply();
        const condition = await this.isUserInvoiceChannel(interaction);
        // require user has to be in a voice channel before using a slash command
        if (!condition) {
            await interaction.followUp(Messages.userJoinVoiceChannel(interaction.user.toString()));
            return;
        }
        try {
            const myCommand = DeployCommands.extractCommands(__dirname, '.command');
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

    public static async autoComplete(interaction: any, client: Client) {
        try {
            const myCommand = DeployCommands.extractCommands(__dirname, '.command');
            if (!myCommand.length) throw new Error();
            for (const command of myCommand) {
                if ((command.data.name === interaction.commandName) && command?.hasAutoComplete) {
                    await command.autocomplete(interaction, client);
                }
            }
        } catch (e: any) {
            console.log(e.toString(), 'deploy.js - command error');
            if (interaction.deletable) {
                await interaction.followUp(e.toString());
            }
        }
    }

    private static async isUserInvoiceChannel(interaction: any): Promise<boolean> {
        const voiceChannel = interaction.member?.voice.channel;
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
}
