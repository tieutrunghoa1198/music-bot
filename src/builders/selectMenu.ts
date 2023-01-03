import {MessageActionRow, MessageSelectMenu} from "discord.js";
import {QueueItem} from "../models/player";
import messages from "../constants/messages";
import {BuilderID} from "../constants/command";
import {CommonConstants} from "../constants/common";

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
                newValue = songInQueue.song.title;
                trackToDisplay.push({label, description, value: newValue});
            } else {
                newValue = songInQueue.song.title + CommonConstants.specialSeparator + (duplicateTimes + 1);
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

