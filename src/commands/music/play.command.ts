import {SlashCommandBuilder} from "@discordjs/builders";
import {Player, players, QueueItem} from "../../models/player";
import {GuildMember} from "discord.js";
import {
    entersState,
    joinVoiceChannel,
    VoiceConnection,
    VoiceConnectionStatus
} from "@discordjs/voice";
import messages from "../../constants/messages";
import {SoundCloudService} from "../../services/soundcloud";
import {Song} from "../../types/song";
import {NotificationService} from "../../services/notification";
import {Command} from '../../constants/command';
import {YoutubeService} from "../../services/youtube";
import play from "play-dl";
export default {
    data: new SlashCommandBuilder()
        .setName(Command.play.name)
        .setDescription(Command.play.description)
        .addStringOption(option => option.setName('input').setDescription('Link to be played').setRequired(true)),
    async execute(interaction: any) {
        await interaction.deferReply();
        let input = interaction.options.getString('input');
        if (input === null) {
            await interaction.followUp(messages.error);
            return;
        }

        let player = players.get(interaction.guildId as string) as Player;
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
            console.log(error)
            return;
        }

        // Logic here
        try {
            // await SoundCloudService.getTrackDetail(input)
            //     .then(async (song: Song) => {
            //         const queueItem: QueueItem = {
            //             song,
            //             requester: interaction.member?.user.username as string
            //         }
            //         await player?.addSong([queueItem]);
            //         await NotificationService.showNowPlaying(player, interaction, queueItem);
            //     });

            await YoutubeService.getVideoDetail(input)
                .then(async (song: Song) => {
                    const queueItem: QueueItem = {
                        song,
                        requester: interaction.member?.user.username as string
                    }
                    await player?.addSong([queueItem])
                    await NotificationService.showNowPlaying(player, interaction, queueItem)
                })
        } catch (e) {
            console.log(e, ' Connect Commands');
            await interaction.followUp(messages.failToPlay);
        }
    }
}
