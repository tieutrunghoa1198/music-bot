import {MessageButtonStyles} from "discord.js/typings/enums";
import {MessageButton} from "discord.js";
import {BuilderID} from "../../constants";

export const prevSongComponent = () => {
    return new MessageButton()
        .setCustomId(BuilderID.prevSong)
        .setStyle(MessageButtonStyles.SECONDARY)
        .setDisabled(true)
        .setEmoji('⬅️')
}
