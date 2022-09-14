import {SlashCommandBuilder} from "@discordjs/builders";
import {ButtonInteraction, EmbedFieldData, MessageActionRow, MessageButton, MessageEmbed} from "discord.js";
import {boldText, codeBlockText} from "../../utils/formatTime";

export default {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('checking player status'),
    async execute(interaction: any) {
        await interaction.deferReply();
        const msg = new MessageEmbed();

        const queueLength = 10;
        msg.setTitle(`:notes: Current Queue | ${queueLength} entries`)
        msg.setColor(0x99FF00)
        for (let i = 0; i < queueLength; i++) {
            const songObj: EmbedFieldData = {
                name: `${codeBlockText('1')} | (${codeBlockText('03:20')}) ${boldText('Strip em down')} - khoidaumoi`,
                value: '** **'
            }
            await msg.addFields(songObj);
        }
        // discord js v13
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('prev')
                    .setLabel('Previous')
                    .setStyle('PRIMARY'),
            ).addComponents(
                new MessageButton()
                    .setCustomId('primary2')
                    .setLabel('Next')
                    .setStyle('PRIMARY'),
            );;

        await interaction.followUp({content: 'test', embeds: [msg], components: [row]})

        const filter = (buttonInteraction: ButtonInteraction) => {
            return interaction.user.id === buttonInteraction.user.id;
        }

        const channel = interaction.channel

        const collector = channel.createMessageComponentCollector({
            filter,
            max: 1,
            time: 1000 * 15
        })

        collector.on('collect', async (i: ButtonInteraction) => {
            await i.deferUpdate();
            // await i.followUp({content: 'test2', embeds: [msg], components: [row]})
        })

        collector.on('end', async (collection: any) => {
            await interaction.editReply({content: 'test2', embeds: [msg], components: [row]});
            return;
        })
        return;
    }
}
