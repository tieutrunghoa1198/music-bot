import messages from "../../constants/messages";
require('dotenv').config()
import {Client} from 'discord.js';
import nextButton from "../ui/response/music/next.button";
import previousButton from "../ui/response/music/previous.button";
import {TrackSelectMenu} from "../ui/response/music/track.selectmenu";
import {RecordSelectMenu} from "../ui/response/music/record.selectmenu";
import {InteractionHandling} from "./interactionHandling";
import {DeployCommands} from "./deployCommands";
export const bootstrap = async (client: Client) => {
    try {
        new DeployCommands();
        await interactionCreate(client)
            .catch(err => console.log(err));
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
