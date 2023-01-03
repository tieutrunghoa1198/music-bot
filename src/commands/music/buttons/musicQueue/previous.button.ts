import {EmbedFieldData, Interaction, MessageEmbed} from "discord.js";
import {Player, players} from "../../../../models/player";
import messages from "../../../../constants/messages";
import {boldText, codeBlockText, formatSeconds} from "../../../../utils/formatTime";
import {generateButton, paginationMsg} from "../../embedMessages/queue.embed";
import {createSelectedTracks} from "../../../../builders/selectMenu";

export default {
    customId: 'prev',
    execute: async (interaction: any) => {
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

            if (msg === null) {
                await interaction.followUp('End of queue!');
                return;
            }

            const btn = await generateButton();
            interaction.channel.messages.fetch(interaction.message.id)
                .then(async (msgRes: any) => {
                    msgRes.edit({
                        embeds: [msg],
                        components: [await createSelectedTracks(player.queue), btn]
                    })
                })
            // await interaction.followUp()
        } catch (e) {
            console.log(e, 'prev btn error');
            await interaction.followUp('End of queue!')
        }
    }
}
