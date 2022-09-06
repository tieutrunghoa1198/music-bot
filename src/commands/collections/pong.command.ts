import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName('pong')
        .setDescription('second order'),
    async execute(interaction: any) {
        await interaction.reply('it works');
    }
}
