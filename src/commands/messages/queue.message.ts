import {EmbedFieldData, MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {Player} from "../../models/player";
import {boldText, codeBlockText, formatSeconds} from "../../utils/formatTime";
import {PlayerQueue} from "../../constants/playerQueue";

export const generateButton = (): MessageActionRow => {
    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('prev')
                .setLabel('⬅️')
                .setStyle('PRIMARY'),
        ).addComponents(
            new MessageButton()
                .setCustomId('next')
                .setLabel('➡️')
                .setStyle('PRIMARY'),
        );
    return row;
}

export const paginationMsg = async (player: Player, currentPage: number): Promise<any> => {
    const {MAX_PER_PAGE} = PlayerQueue;
    let msg = new MessageEmbed();
    const queueLength = player.queue.length;
    const numberOfPages = Math.ceil(queueLength/MAX_PER_PAGE);

    if (currentPage > numberOfPages || currentPage <= 0) {
        console.log(currentPage, numberOfPages);
        return null;
    }

    msg.setTitle(`:notes: Danh sách hiện tại | ${queueLength} bài hát`)
    msg.setColor(0x99FF00)
    for (let i = 0; i < MAX_PER_PAGE; i++) {
        const songIndex = MAX_PER_PAGE * (currentPage - 1) + i;
        if (songIndex >= player.queue.length) {
            break;
        }
        const song = player.queue[songIndex].song;
        const songObj: EmbedFieldData = {
            name: `${codeBlockText((songIndex+1).toString())} | (${codeBlockText(formatSeconds(song.length))}) ${boldText(song.title)} - khoidaumoi`,
            value: '** **'
        }
        await msg.addFields(songObj);
    }
    msg.setFooter({
        text: `Trang: ${currentPage}/${numberOfPages}`,
        iconURL: 'https://i.imgur.com/AfFp7pu.png'
    });
    return msg;
}
