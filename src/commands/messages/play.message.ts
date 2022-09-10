import {Platform} from "../../types/song";
import {EmbedFieldData, MessageEmbed} from "discord.js";
import messages from "../../constants/messages";

export const createPlayeMessage = (payload: {
    requester: string;
    thumbnail: string;
    author: string;
    length: string;
    title: string;
    platform: string;
    guildName: string;
    icon: string
}): MessageEmbed => {
    const author: EmbedFieldData = {
        name: messages.author,
        value: payload.author,
        inline: true
    }

    const length: EmbedFieldData = {
        name: messages.length,
        value: `\`${payload.length}\``,
        inline: true
    }

    const platform: EmbedFieldData = {
        name: messages.platform,
        value: payload.platform,
        inline: true
    }

    const requestedBy: EmbedFieldData = {
        name: messages.requestedBy,
        value: payload.requester,
    }

    return new MessageEmbed()
        .setTitle(payload.title)
        .setColor(0x99FF00)
        .setAuthor({ name: `${payload.guildName} - Đang phát`, iconURL: payload.icon })
        .setThumbnail(payload.thumbnail)
        .addFields(author, platform, length, requestedBy);
}