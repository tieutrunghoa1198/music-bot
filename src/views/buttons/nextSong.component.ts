import {MessageButtonStyles} from "discord.js/typings/enums";
import {BuilderID} from "../../constants/index";
import {MessageButton} from "discord.js";
export const nextSongComponent = () => {
    return new MessageButton()
        .setCustomId(BuilderID.nextSong)
        .setStyle(MessageButtonStyles.SECONDARY)
        .setDisabled(false)
        .setEmoji('➡️')
}