import {MessageButton} from "discord.js";
import {BuilderID} from "../../constants";
import {MessageButtonStyles} from "discord.js/typings/enums";

export const removeAudioComponent = () => {
    return new MessageButton()
        .setCustomId(BuilderID.removeAudio)
        .setStyle(MessageButtonStyles.DANGER)
        .setDisabled(false)
        .setEmoji('❕')
}
