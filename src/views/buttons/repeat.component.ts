import {MessageButtonStyles} from "discord.js/typings/enums";
import {BuilderID} from "../../constants";
import {MessageButton} from "discord.js";

export const repeatComponent = () => {
    return new MessageButton()
        .setCustomId(BuilderID.repeatSong)
        .setStyle(MessageButtonStyles.SECONDARY)
        .setDisabled(false)
        .setEmoji('🔂')
}
