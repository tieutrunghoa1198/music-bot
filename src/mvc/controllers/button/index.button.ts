import {Client} from "discord.js";
import messages from "../../../constants/messages";
import nextButton from "./next.button";
import previousButton from "./previous.button";
import {ephemeralResponse} from "../../../utils/common";

export const handleButton = async (interaction: any, client: Client) => {
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
