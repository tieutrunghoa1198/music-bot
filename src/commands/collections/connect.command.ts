import { SlashCommandBuilder } from "@discordjs/builders";
import {Player, players} from "../../models/player";
import {GuildMember} from "discord.js";
import {joinVoiceChannel} from "@discordjs/voice";
import messages from "../../constants/messages";

export default {
    data: new SlashCommandBuilder()
        .setName('connect')
        .setDescription('conect to a voice channel'),
    async execute(interaction: any) {
        // await interaction.deferReply();
        let player = players.get(interaction.guildId as string);
        // console.log(player + '========== line 1 =========')
        if (!player) {
            if (
                interaction.member instanceof GuildMember &&
                interaction.member.voice.channel
            ) {
                const channel = interaction.member.voice.channel;
                player = new Player(
                    joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator,
                    }),
                    interaction.guildId as string
                );

                players.set(interaction.guildId as string, player);
            }
        } else {
            await interaction.reply(messages.joinVoiceChannel);
            console.log('error at line 35')
        }

    }
}
