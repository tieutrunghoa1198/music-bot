import messages from "../constants/messages";
require('dotenv').config()
import {Client} from 'discord.js';
import nextButton from "./button-controllers/next.button";
import previousButton from "./button-controllers/previous.button";
import {TrackSelectMenu} from "./selectmenu-controllers/track.selectmenu";
import {RecordSelectMenu} from "./selectmenu-controllers/record.selectmenu";
import {DeployCommands} from "./command-controllers/deployCommands";
import {InteractionHandling} from "./command-controllers/interactionHandling";
import {MessageController} from "./message-controllers/index.message";
import {BuilderID} from "../constants/musicCommands";
export const bootstrap = async (client: Client) => {
    try {
        new DeployCommands();
        await interactionCreate(client)
            .catch(err => console.log(err));
        await MessageController.handle(client);
    } catch (e) {
        console.log(e, 'Error: at index.command.ts');
    }
};

const ephemeralResponse = async (interaction: any, message: string) => {
    await interaction.followUp({
        content: message,
        ephemeral: true
    });
}

const interactionCreate = async (client: Client) => {
    client.on('interactionCreate', async (interaction: any) => {
        if (interaction.isCommand()) {
            const slashCmd = new InteractionHandling(interaction, client);
            await slashCmd.slashCommand();
        }

        if (interaction.isSelectMenu()) {
            await interaction.deferUpdate();
            await handleSelectMenu(interaction, client);
        }

        if (interaction.isButton()) {
            await interaction.deferUpdate();
            await handleButton(interaction, client);
        }
    })
}

const handleSelectMenu = async (interaction: any, client: Client) => {
    try {
        const condition = interaction.member.voice.channel;
        if (!condition) {
            await ephemeralResponse(interaction, messages.userJoinVoiceChannel(interaction.user.toString()))
            return;
        }
        switch (interaction.customId) {
            case BuilderID.trackSelectMenu:
                await TrackSelectMenu.interaction(interaction, client);
                break;
            case BuilderID.pageSelectMenu:
                await RecordSelectMenu.interaction(interaction, client);
                break;
            default:
                break;
        }
    } catch (e) {
        console.log(e);
        await interaction.followUp(messages.error + ': Select menu track!');
    }
}

const handleButton = async (interaction: any, client: Client) => {
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
        console.log(e, 'mvc Button error');
        await interaction.followUp(messages.error + 'mvc Button error');
    }
}
