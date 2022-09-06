import { SlashCommandBuilder } from "@discordjs/builders";

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('kiem tra ping'),
    async execute(interaction: any) {
        await interaction.reply('it works');
    }
}
