import {EmbedFieldData, Interaction, MessageEmbed} from "discord.js";
import {Player, players} from "../../../../models/player";
import messages from "../../../../constants/messages";
import {generateButton, paginationMsg} from "../../embedMessages/queue.embed";
import {createSelectedTracks} from "../../../../builders/selectMenu";

export default {
    customId: 'next',
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
            const nextPage = currentPage + 1;
            const msg = await paginationMsg(player, nextPage);

            if (msg === null) {
                await interaction.followUp('Max page!')
                return;
            }

            const btn = await generateButton();
            const message = await interaction.channel.messages.fetch(interaction.message.id);
            await message.edit({
                embeds: [msg],
                components: [await createSelectedTracks(player.queue), btn]
            });
        } catch (e) {
            console.log(e, 'next btn error');
            await interaction.followUp('Max page!')
        }
    }
}
