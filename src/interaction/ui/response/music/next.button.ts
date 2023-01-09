import {Client} from "discord.js";
import {Player, players} from "../../../../object/player";
import messages from "../../../../constants/messages";
import {paginationMsg} from "../../builder/embedMessages/queue.embed";
import {createSelectedTracks, numberOfPageSelectMenu} from "../../builder/selectMenu/selectMenu";
import {generateButton} from "../../builder/buttons/buttons";
import {CommonConstants} from "../../../../constants/common";
import {PlayerQueue} from "../../../../constants/playerQueue";

export default {
    customId: 'next',
    execute: async (interaction: any, client: Client) => {
        const player = players.get(interaction.guildId as string) as Player;
        if (!player) {
            await interaction.followUp(messages.joinVoiceChannel);
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
                // interaction.followUp('Hết trang!')
                //     .then(async (message: any) => {
                //         setTimeout(async () => {
                //             if (message.deletable) {
                //                 await message.delete().catch((err: any) => {
                //                     console.log(err);
                //                     return;
                //                 })
                //             }
                //         }, CommonConstants.defaultDeleteTime)
                //     });
                return;
            }

            const btn = await generateButton(nextPage, maxPage);
            const message = await interaction.channel.messages.fetch(interaction.message.id);
            await message.edit({
                embeds: [msg.embedMessage],
                components: [
                    await createSelectedTracks(msg.tracks),
                    await numberOfPageSelectMenu(player.queue.length/PlayerQueue.MAX_PER_PAGE, nextPage),
                    btn
                ]
            });
        } catch (e) {
            console.log(e, 'next btn error');
            await interaction.followUp('Max page!')
        }
    }
}
