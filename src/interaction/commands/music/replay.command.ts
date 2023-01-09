import {SlashCommandBuilder} from "@discordjs/builders";
import {players} from "../../../object/player";
import messages from "../../../constants/messages";
import {MusicCommand} from "../../../constants/musicCommand";
import {Client} from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName(MusicCommand.replay.name)
        .setDescription(MusicCommand.replay.description)
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
            await interaction.followUp(messages.joinVoiceChannel);
            return;
        }
        player.isReplay = isReplay;
        await interaction.followUp(messages.replay(isReplay ? 'Bật' : 'Tắt'));
    }
}
