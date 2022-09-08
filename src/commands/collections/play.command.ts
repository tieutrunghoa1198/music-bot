import { SlashCommandBuilder } from "@discordjs/builders";
import {Player, players} from "../../models/player";
import {GuildMember} from "discord.js";
import {entersState, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus} from "@discordjs/voice";
import messages from "../../constants/messages";
import {SoundCloudService} from "../../services/soundcloud";

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Phát nhạc bằng link')
        .addStringOption(option => option.setName('link').setDescription('Link to be played')),
    async execute(interaction: any) {
        await interaction.deferReply();

        let input = interaction.options.getString('link');
        if (input === null) {
            await interaction.followUp(messages.error);
            return;
        }

        let player = players.get(interaction.guildId as string);
        if (!player) {
            if (
                interaction.member instanceof GuildMember &&
                interaction.member.voice.channel
            ) {
                /*
                * if there are a person in a voice channel -> create a voiceConnection
                * (and is a member)
                * */
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
        }

        if (!player) {
            await interaction.followUp(messages.joinVoiceChannel);
        }

        // Make sure the connection is ready before processing the user's request
        try {
            await entersState(
                <VoiceConnection>player?.voiceConnection,
                VoiceConnectionStatus.Ready,
                10e3,
            );
        } catch (error) {
            await interaction.followUp(messages.failToJoinVoiceChannel);
            return;
        }

        // Logic here
        try {
            await SoundCloudService.getTrackDetail(input);
            await interaction.followUp(messages.alreadyPlaying);
        } catch (e) {
            console.log(e, ' Connect Commands');
            await interaction.followUp(messages.failToPlay);
        }
    }
}
