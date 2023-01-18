import {Player, players, QueueItem} from "../../../../object/player";
import messages from "../../../../constants/messages";
import {GlobalConstants} from "../../../../constants/common";
import {Client, Message} from "discord.js";
import {BuilderID} from "../../../../constants/musicCommands";
import {createSelectedTracks, numberOfPageSelectMenu} from "../../builder/selectMenu/selectMenu";
import {PlayerQueue} from "../../../../constants/playerQueue";
import {paginationMsg} from "../../builder/embedMessages/queue.embed";
import {generateButton} from "../../builder/buttons/buttons";

async function interaction(interaction: any, client: Client) {
    if (interaction.customId !== BuilderID.pageSelectMenu) {
        return;
    }

    const player = players.get(interaction.guildId) as Player;
    if (!player) {
        await interaction.followUp(messages.joinVoiceChannel);
        return;
    }

    try {
        if (player.queue.length > 0) {
            const result = await interaction.values[0];
            const msg = await paginationMsg(player, parseInt(result));
            const maxPage = Math.ceil(player.queue.length/PlayerQueue.MAX_PER_PAGE);
            const btn = generateButton(parseInt(result), maxPage);
            const message = await interaction.channel.messages.fetch(interaction.message.id)
            await message.edit({
                embeds: [msg?.embedMessage],
                components: [
                    await createSelectedTracks(msg?.tracks),
                    await numberOfPageSelectMenu(player.queue.length/PlayerQueue.MAX_PER_PAGE, parseInt(result)),
                    btn
                ]
            })
        } else {
            await interaction.followUp(messages.emptyQueue);
        }
    } catch (e) {
        console.log(e)
        await interaction.followUp(messages.error);
    }
}
export const RecordSelectMenu = {
    interaction,
}


