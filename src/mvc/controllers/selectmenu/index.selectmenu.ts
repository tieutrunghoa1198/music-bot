import {Client} from "discord.js";
import messages from "../../../constants/messages";
import {BuilderID} from "../../../constants/musicCommands";
import {TrackSelectMenu} from "./track.selectmenu";
import {RecordSelectMenu} from "./record.selectmenu";
import {ephemeralResponse} from "../../../utils/common";

export const handleSelectMenu = async (interaction: any, client: Client) => {
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
