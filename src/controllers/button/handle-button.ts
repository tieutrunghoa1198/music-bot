import {Client} from "discord.js";
import {ephemeralResponse} from "@/utils/common";
import {DeployCommands} from "@/utils/deployCommands";
import {Messages} from "@/constants/messages.constant";

export const handleButton = async (interaction: any, client: Client) => {
    try {
        const condition = interaction.member.voice.channel;
        if (!condition) {
            await ephemeralResponse(interaction, Messages.userJoinVoiceChannel(interaction.user.toString()))
            return;
        }
        const myButtons = DeployCommands.extractCommands(__dirname, '.button');
        if (!myButtons.length) throw new Error();
        for (const button of myButtons) {
            if (button.customId === interaction.customId) {
                await button.execute(interaction, client);
            }
        }
    } catch (e: any) {
        console.log(e, 'mvc Button error');
        await interaction.followUp(Messages.error + 'mvc Button error');
    }
}
