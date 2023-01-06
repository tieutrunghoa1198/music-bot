import {Client, EmbedFieldData, Interaction, MessageEmbed} from "discord.js";
import {Player, players} from "../../../../object/player";
import messages from "../../../../constants/messages";
import {boldText, codeBlockText, formatSeconds} from "../../../../utils/formatTime";
import {paginationMsg} from "../../builder/embedMessages/queue.embed";
import {createSelectedTracks, numberOfPageSelectMenu} from "../../builder/selectMenu/selectMenu";
import {generateButton} from "../../builder/buttons/buttons";
import {CommonConstants} from "../../../../constants/common";
import {PlayerQueue} from "../../../../constants/playerQueue";

export default {
    customId: 'prev',
    execute: async (interaction: any, client: Client) => {
        await interaction.deferUpdate();

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
            const prevPage = currentPage - 1;
            const msg = await paginationMsg(player, prevPage);

            if (msg?.embedMessage === null || msg?.embedMessage === undefined) {
                interaction.followUp('Trước đấy không còn gì cả!')
                    .then(async (message: any) => {
                        setTimeout(async () => {
                            if (message.deletable) {
                                await message.delete().catch((err: any) => {
                                    console.log(err);
                                    return;
                                })
                            }
                        }, CommonConstants.defaultDeleteTime)
                    });
                return;
            }

            const btn = await generateButton();
            const message = await interaction.channel.messages.fetch(interaction.message.id)
            await message.edit({
                embeds: [msg?.embedMessage],
                components: [
                    await createSelectedTracks(msg.tracks),
                    await numberOfPageSelectMenu(player.queue.length/PlayerQueue.MAX_PER_PAGE, prevPage),
                    btn
                ]
            })
        } catch (e) {
            console.log(e, 'prev btn error');
            await interaction.followUp('End of queue!')
        }
    }
}
