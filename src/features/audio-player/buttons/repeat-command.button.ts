import { BuilderID, Messages, players } from '@/core/constants/index.constant';
import { IButtonCommand } from '@/core/interfaces/command.interface';

export const repeatCommandButton: IButtonCommand = {
  customId: BuilderID.repeatSong,
  execute: async (interaction: any) => {
    await interaction.deferReply();

    const player = players.get(interaction.guildId as string);
    if (!player) {
      await interaction.followUp(Messages.joinVoiceChannel);
      return;
    }
    player.isReplay = !player.isReplay;
    await interaction.followUp(
      Messages.replay(player.isReplay ? 'Bật' : 'Tắt'),
    );
  },
};
