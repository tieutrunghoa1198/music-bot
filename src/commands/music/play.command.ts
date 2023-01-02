import {SlashCommandBuilder} from "@discordjs/builders";
import {Player, players, QueueItem} from "../../models/player";
import messages from "../../constants/messages";
import {Song} from "../../types/song";
import {NotificationService} from "../../services/notification";
import {Command} from '../../constants/command';
import {YoutubeService} from "../../services/youtube";
import {SoundCloudService} from "../../services/soundcloud";
import {Link, PlayFeature} from "../../features/play";
import {SpotifyService} from "../../services/spotify";

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
            player = await PlayFeature.createPlayer(interaction);
        }
        const username = interaction.member?.user.username || '';
        const linkType = await PlayFeature.classify(input);

        try {
            await PlayFeature.enterReadyState(player);
        }catch (e) {
            await interaction.followUp(messages.joinVoiceChannel);
            console.log('cannot enter ready state')
            return;
        }

        switch (linkType) {
            case Link.YoutubeTrack:
                await YoutubeService.getVideoDetail(input)
                    .then(async (track: Song) => {
                        const queueItem: QueueItem = await PlayFeature.handleTrack(track, player, username);
                        await NotificationService.showNowPlaying(player, interaction, queueItem)
                    });
                break;
            case Link.YoutubeRandomList:
                await YoutubeService.getRandomList(input)
                    .then(async data => {
                        await PlayFeature.handlePlaylist(data.songs, player, username).then(async (queueItems: QueueItem[]) => {
                            await NotificationService.showNowPlaying(player, interaction, queueItems[0]);
                        });
                    })
                break;
            case Link.SoundCloudTrack:
                await SoundCloudService.getTrackDetail(input)
                    .then(async (track: Song) => {
                        const queueItem: QueueItem = await PlayFeature.handleTrack(track, player, username);
                        await NotificationService.showNowPlaying(player, interaction, queueItem)
                    })
                break;
            case Link.SoundCloudPlaylist:
                await SoundCloudService.getPlaylist(input)
                    .then(async data => {
                        await PlayFeature.handlePlaylist(data.songs, player, username).then(async (queueItems: QueueItem[]) => {
                            await NotificationService.showNowPlaying(player, interaction, queueItems[0]);
                        });
                    })
                break;
            case Link.Spotify:
                await SpotifyService.getUrlInfo(input)
                    .then(async songs => {
                        songs = songs as Song[]
                        await PlayFeature.handlePlaylist(songs, player, username).then(async (queueItems: QueueItem[]) => {
                            await NotificationService.showNowPlaying(player, interaction, queueItems[0]);
                        });
                    });
                break;
            default:
                await interaction.followUp(messages.notALink);
                break;
        }
    }
}




