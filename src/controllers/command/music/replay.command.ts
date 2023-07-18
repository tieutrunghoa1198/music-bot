import {SlashCommandBuilder} from "@discordjs/builders";
import {Client} from "discord.js";
import {players} from "../../../models/abstractPlayer";
import {Messages, MusicCommands} from "../../../constants";

export default {
    data: new SlashCommandBuilder()
        .setName(MusicCommands.replay.name)
        .setDescription(MusicCommands.replay.description)
        .setDMPermission(false)
        .addStringOption(option =>
            option.setName('replay')
                .setDescription('on/off')
                .setRequired(true)
                .addChoices(
                    { name: 'Bật', value: 'true' },
                    { name: 'Tắt', value: 'false' },
                )),
    async execute(interaction: any, client: Client) {
        const isReplay = JSON.parse(interaction.options.getString('replay')) as boolean;
        let player = players.get(interaction.guildId as string);
        if (!player) {
            await interaction.followUp(Messages.joinVoiceChannel);
            return;
        }
        player.isReplay = isReplay;
        await interaction.followUp(Messages.replay(isReplay ? 'Bật' : 'Tắt'));
    }
}
