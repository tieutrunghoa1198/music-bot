import {MessageButton} from "discord.js";
import {BuilderID} from "../../constants/index.constant";
import {MessageButtonStyles} from "discord.js/typings/enums";

export const pauseResumeComponent = () => {
    return new MessageButton()
        .setCustomId(BuilderID.pauseResume)
        .setStyle(MessageButtonStyles.SECONDARY)
        .setDisabled(false)
        .setEmoji('⏯')
}
