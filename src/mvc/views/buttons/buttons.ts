import {MessageActionRow, MessageButton} from "discord.js";

export const generateButton = (currentPage: number, maxPage: number): MessageActionRow => {
    let isPrevDisable = false;
    let isNextDisable = false;
    if (currentPage <= 1) {
        isPrevDisable = true;
    }
    if (currentPage >= maxPage) {
        isNextDisable = true;
    }
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('prev')
                .setLabel('← Trang Trước')
                .setStyle('PRIMARY')
                .setDisabled(isPrevDisable),
        ).addComponents(
            new MessageButton()
                .setCustomId('next')
                .setLabel('Trang Sau →')
                .setStyle('PRIMARY')
                .setDisabled(isNextDisable),
        );
    return row;
}
