import {EmbedFieldData, MessageEmbed} from "discord.js";
import messages from "../../../../constants/messages";

export const AddSongMessage = (payload: any) => {

    const author: EmbedFieldData = {
        name: messages.platform,
        value: payload.platform,
        inline: true
    }

    return new MessageEmbed()
        .setTitle(payload.title)
        .setColor(0x99FF00)
        .setAuthor({ name: `${payload.guildName} - Đang phát`, iconURL: payload.icon })
        .setThumbnail(payload.thumbnail)
        .addFields(author);
}
