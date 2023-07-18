import {MessageButton} from "discord.js";
import {BuilderID} from "../../constants";
import {MessageButtonStyles} from "discord.js/typings/enums";

export const clearQueueComponent = () => {
    return new MessageButton()
        .setCustomId(BuilderID.clearQueue)
        .setStyle(MessageButtonStyles.SECONDARY)
        .setDisabled(false)
        .setEmoji('⏭')
}
