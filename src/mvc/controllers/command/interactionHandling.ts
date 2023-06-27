import {Client, Interaction} from "discord.js";
import messages from "../../../constants/messages";
import path from "node:path";
import fs from "node:fs";
import {DeployCommands} from "./deployCommands";

export class InteractionHandling {
    private readonly interaction: any;
    private readonly client: Client;
    constructor(interaction: Interaction, client: Client) {
        this.interaction = interaction;
        this.client = client;
    }

    public async slashCommand() {
        await this.interaction.deferReply();
        const condition = await this.isUserInvoiceChannel();
        // require user has to be in a voice channel before using a slash command
        if (!condition) {
            await this.interaction.followUp(messages.userJoinVoiceChannel(this.interaction.user.toString()));
            return;
        }
        try {
            const myCommand = DeployCommands.extractCommands();
            if (!myCommand.length) throw new Error();
            for (const command of myCommand) {
                if (command.data.name === this.interaction.commandName) {
                    await command.execute(this.interaction, this.client);
                }
            }
        } catch (e: any) {
            console.log(e.toString(), 'deploy.js - command error');
            if (this.interaction.deletable) {
                await this.interaction.followUp(e.toString());
            }
        }
    }

    public async autoComplete() {
        try {
            const myCommand = DeployCommands.extractCommands();
            if (!myCommand.length) throw new Error();
            for (const command of myCommand) {
                if ((command.data.name === this.interaction.commandName) && command?.hasAutoComplete) {
                    await command.autocomplete(this.interaction, this.client);
                }
            }
        } catch (e: any) {
            console.log(e.toString(), 'deploy.js - command error');
            if (this.interaction.deletable) {
                await this.interaction.followUp(e.toString());
            }
        }
    }

    private async isUserInvoiceChannel(): Promise<boolean> {
        const voiceChannel = this.interaction.member?.voice.channel;
        const folderName = 'music';
        const folderPath = path.join(__dirname, folderName);
        const files = fs.readdirSync(folderPath);
        let result = true;
        files.forEach((file: any) => {
            const filePath = path.join(folderPath, file)
            const command = require(filePath);
            const commandName = command.default.data.name;
            if (commandName === this.interaction.commandName) {
                if (voiceChannel === null || voiceChannel === undefined) {
                    result = false;
                }
            }
        })
        return result;
    }
}
