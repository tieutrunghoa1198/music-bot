import {SlashCommandBuilder} from "@discordjs/builders";
import {createSelectedTracks} from "@/views/selectMenu/selectMenu";
import {Player} from "@/models/player";
import * as Constant from '../../../constants'
import {Client} from "discord.js";
import {players} from "@/models/abstractPlayer";
import {SoundCloudService} from "@/services/music/soundcloud";

export default {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('checking player status')
        .setDMPermission(false),
    async execute(interaction: any, client: Client) {
        const ads = new SoundCloudService();
        await ads.updateToken()
        const player = players.get(interaction.guildId) as Player;
        if (!player) {
            await interaction.followUp(Constant.Messages.joinVoiceChannel);
            return;
        }
        if (player?.queue.length > 0) {
            await interaction.followUp({ components: [await createSelectedTracks(player.queue)]});
        } else {
            await interaction.followUp({ content: Constant.Messages.emptyQueue})
        }
    }
}
