import {MessageActionRow, MessageButton} from "discord.js";

export const generateButton = (): MessageActionRow => {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('prev')
                .setLabel('← Trang Trước')
                .setStyle('PRIMARY'),
        ).addComponents(
            new MessageButton()
                .setCustomId('next')
                .setLabel('Trang Sau →')
                .setStyle('PRIMARY'),
        );
    return row;
}
