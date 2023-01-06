import {MessageActionRow, MessageSelectMenu} from "discord.js";
import {QueueItem} from "../../../../object/player";
import messages from "../../../../constants/messages";
import {BuilderID} from "../../../../constants/command";
import {CommonConstants} from "../../../../constants/common";
import {PlayerQueue} from "../../../../constants/playerQueue";

export const createSelectedTracks = async (queueItems: QueueItem[]) => {
    const trackToDisplay: any[] = [];

    for (const songInQueue of queueItems) {
        if (trackToDisplay.length > 24) {
            continue;
        }

        let label = songInQueue.song.title;
        let description = songInQueue.song.author;
        let value = songInQueue.song.title;
        if (trackToDisplay.length < 1) {
            trackToDisplay.push({label, description, value});
        } else {
            // từ thằng thứ 2 trỏ đi check trùng hay không
            let duplicateTimes = 0;
            let newValue = '';
            let lastIndex = 0;
            for (let i = 0; i < trackToDisplay.length; i++) {
                let condition = trackToDisplay[i].value.includes(songInQueue.song.title);
                if (condition) {
                    duplicateTimes++;
                    lastIndex = i;
                }
            }
            if (duplicateTimes == 0) {
                newValue = songInQueue.song.title.substring(0, 60);
                trackToDisplay.push({label, description, value: newValue});
            } else {
                newValue = songInQueue.song.title.substring(0, 60) + CommonConstants.specialSeparator + (duplicateTimes + 1);
                trackToDisplay.push({label, description, value: newValue});
            }
        }
    }
    return new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId(BuilderID.trackSelectMenu)
                .setPlaceholder(messages.selectSongToPlay + ` | ${trackToDisplay.length} bài`)
                .addOptions(trackToDisplay),
        );

}

export const numberOfPageSelectMenu = async (rawSize: number, currentPage: number) => {
    const size = Math.ceil(rawSize);
    const arrSize = PlayerQueue.RECORD_PAGE_SIZE;
    const listPages: any[] = [];
    const range: number = PlayerQueue.RANGE;
    // zero means start from beginning
    let start = currentPage - range < 0 ? 0 : currentPage - range;
    if (size - arrSize < start) {
        start = size - arrSize;
        if (start < 0) start = 0;
    }
    // double the range then minus 1
    let end = start + ((range*2) - 1) > size ? size : start + ((range*2) - 1);
    console.log(start, 'start')
    console.log(end, 'end' )
    for (let i = start; i < end; i++) {
        listPages.push(
            {
                label: `Trang ${i+1}`,
                value: (i+1).toString(),
                default: (i + 1) === currentPage
            }
        )
    }
    return new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId(BuilderID.pageSelectMenu)
                .setPlaceholder(`Chọn trang | ${listPages.length} trang.`)
                .addOptions(listPages),
        );
}

