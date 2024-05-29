import {ISlashCommand} from "@/core/interfaces/command.interface";
import {SlashCommandBuilder} from "@discordjs/builders";
import {players} from "@/core/constants/common.constant";
import {Messages} from "@/core/constants/messages.constant";

export const seekCommand: ISlashCommand = {
    data: new SlashCommandBuilder().setName('seek').setDescription('Tua nhac'),
    async execute(interaction: any) {
        await interaction.deferReply();

        const player = players.get(interaction.guildId as string);
        if (!player) {
            await interaction.followUp(Messages.joinVoiceChannel);
            return;
        }

        player.seek();
        await interaction.followUp('cool');
    }
}