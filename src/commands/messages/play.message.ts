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
        value: payload.length,
        inline: true
    }

    const platform: EmbedFieldData = {
        name: 'Platform',
        value: payload.platform,
        inline: true
    }

    return new MessageEmbed()
        .setTitle(payload.title)
        .setAuthor({ name: `${payload.guildName} - Đang phát`, iconURL: payload.icon })
        .setThumbnail(payload.thumbnail)
        .addFields(author, platform, length);
}