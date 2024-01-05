import {Client} from "discord.js";
import {Player} from "../../../models/player";
import {paginationMsg} from "../../../views/embedMessages/queue.embed";
import {createSelectedTracks, numberOfPageSelectMenu} from "../../../views/selectMenu/selectMenu";
import {players} from "../../../models/abstract-player.model";
import {Messages, PlayerQueue} from "../../../constants/index.constant";
import {generateButton} from "../../../views/buttons";


export default {
    customId: 'next',
    execute: async (interaction: any, client: Client) => {
        const player = players.get(interaction.guildId as string) as Player;
        if (!player) {
            await interaction.followUp(Messages.joinVoiceChannel);
            return;
        }
        if (!interaction.message.embeds[0].footer) {
            console.log('there is no footer')
            return;
        }
        try {
            const footer = interaction.message.embeds[0].footer;
            const currentPage = parseInt(footer.text.split(':')[1].trim().split('/')[0], 10);
            const maxPage = parseInt(footer.text.split(':')[1].trim().split('/')[1], 10);
            const nextPage = currentPage + 1;
            const msg = await paginationMsg(player, nextPage);

            if (msg?.embedMessage === null || msg?.embedMessage === undefined) {
                return;
            }

            const btn = await generateButton(nextPage, maxPage);
            const message = await interaction.channel.messages.fetch(interaction.message.id)
            message.delete().catch((error: any) => {
                // Only log the error if it is not an Unknown Message error
                if (error) {
                    console.error('Failed to delete the message:', error);
                    return;
                }
            });
            interaction.followUp({
                embeds: [msg.embedMessage],
                components: [
                    await createSelectedTracks(msg?.tracks),
                    await numberOfPageSelectMenu(player.queue.length/PlayerQueue.MAX_PER_PAGE, nextPage),
                    btn
                ]
            })
        } catch (e) {
            console.log(e, 'next btn error');
            await interaction.followUp('Max page!')
        }
    }
}
