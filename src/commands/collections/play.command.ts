import { SlashCommandBuilder } from "@discordjs/builders";
import {Player, players, QueueItem} from "../../models/player";
import {GuildMember} from "discord.js";
import {entersState, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus} from "@discordjs/voice";
import messages from "../../constants/messages";
import {SoundCloudService} from "../../services/soundcloud";
import {Platform, Song} from "../../types/song";
import {createPlayeMessage} from "../messages/play.message";
import {formatSeconds} from "../../utils/formatTime";

export default {
    data: new SlashCommandBuilder()
        .setName('hplay')
        .setDescription('Phát nhạc bằng link')
        .addStringOption(option => option.setName('input').setDescription('Link to be played')),
    async execute(interaction: any) {
        await interaction.deferReply();

        let input = interaction.options.getString('input');
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
            await SoundCloudService.getTrackDetail(input)
                .then(async (song: Song) => {
                    const queueItem: QueueItem = {
                        song,
                        requester: interaction.member?.user.username as string
                    }
                    await player?.addSong([queueItem]);
                    const guildName = interaction.member.guild.name;
                    const icon = interaction.member.guild.iconURL();
                    const payload = {
                        title: song.title,
                        author: song.author,
                        thumbnail: song.thumbnail,
                        length: formatSeconds(song.length),
                        platform: Platform.SOUND_CLOUD,
                        guildName,
                        requester: queueItem.requester,
                        icon
                    }
                    interaction.followUp({ embeds: [createPlayeMessage(payload)]});
                });
        } catch (e) {
            console.log(e, ' Connect Commands');
            await interaction.followUp(messages.failToPlay);
        }
    }
}
