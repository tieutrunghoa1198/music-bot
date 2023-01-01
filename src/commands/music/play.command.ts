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
import {Song} from "../../types/song";
import {NotificationService} from "../../services/notification";
import {Command} from '../../constants/command';
import {YoutubeService} from "../../services/youtube";
import {SoundCloudService} from "../../services/soundcloud";
import {soundCloudTrackRegex, youtubeVideoRegex} from "../../constants/regex";

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

        await promptUserToJoin( interaction)
            .then(async player => {
                if (player == null || player == undefined) {
                    return;
                }
                // Make sure the connection is ready before processing the user's request
                // @ts-ignore
                await enterReadyState(interaction, player);

                // Logic here
                // @ts-ignore
                await processInput(interaction, player);
            })
            .catch(async err => {
                console.log(err, '[ERROR]: play.command.ts // ' + err);
                await interaction.followUp(messages.error);
                return;
            });
    }
}

const promptUserToJoin = async (interaction: any) => {
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
            return player;
        }
    }

    if (!player) {
        await interaction.followUp(messages.joinVoiceChannel);
        return;
    }
    await processInput(interaction, player);
}

const enterReadyState = async (interaction: any, player: Player) => {
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
}

const processInput = async (interaction: any, player: Player) => {
    const input = interaction.options.getString('input');
    switch (true) {
        case input.match(youtubeVideoRegex)?.length > 0:
            await handleYoutubeInput(interaction, player);
            break;
        case input.match(soundCloudTrackRegex)?.length > 0:
            await handleSoundCloudInput(interaction, player);
            break;
        default:
            await interaction.followUp(messages.notALink);
            break;
    }
}

const handleYoutubeInput = async (interaction: any, player: Player) => {
    const input = interaction.options.getString('input');
    if (input.includes('&list=')) {
        await handleYTRandomList(interaction, player);
        return;
    }
    await handleYTVideo(interaction, player);
}

const handleYTRandomList = async (interaction: any, player: Player) => {
    const input = interaction.options.getString('input');
    const rdList = await YoutubeService.getRandomList(input);
    const queueItems: QueueItem[] = [];
    await rdList.songs.forEach(song => {
        queueItems.push({
            song,
            requester: interaction.member?.user.username as string
        })
    });

    await player?.addSong(queueItems);
    await NotificationService.showNowPlaying(player, interaction, queueItems[0])
}

const handleYTVideo = async (interaction: any, player: Player) => {
    const input = interaction.options.getString('input');
    try {
        await YoutubeService.getVideoDetail(input)
            .then(async (song: Song) => {
                const queueItem: QueueItem =
                    {
                        song,
                        requester: interaction.member?.user.username as string
                    }
                await player?.addSong([queueItem])
                await NotificationService.showNowPlaying(player, interaction, queueItem)
                console.log(`[INFO]: ${song.url}, requester: ${interaction.member?.user.username}`)
            })
    } catch (e) {
        await interaction.followUp(messages.failToPlay);
        console.log(e, ' Connect Commands');
    }
}

const handleSoundCloudInput = async (interaction: any, player: Player) => {
    const input = interaction.options.getString('input');
    if (SoundCloudService.isPlaylist(input)) {
        await handleSCPlaylist(interaction, player);
        return;
    }
    await handleSCTrack(interaction, player);
}

const handleSCTrack = async (interaction: any, player: Player) => {
    const input = interaction.options.getString('input');
    try {
        await SoundCloudService.getTrackDetail(input)
            .then(async (song: Song) => {
                const queueItem: QueueItem = {
                    song,
                    requester: interaction.member?.user.username as string
                }
                console.log(`[INFO]: ${song.url}, requester: ${interaction.member?.user.username}`)
                await player?.addSong([queueItem])
                await NotificationService.showNowPlaying(player, interaction, queueItem)
            })
    } catch (e) {
        console.log(e, ' Connect Commands');
        await interaction.followUp(messages.failToPlay);
    }
}

const handleSCPlaylist = async (interaction: any, player: Player) => {
    const input = interaction.options.getString('input');
    try {
        const resultList = await SoundCloudService.getPlaylist(input);
        const queueItems: QueueItem[] = [];
        await resultList.songs.forEach(song => {
            queueItems.push({
                song,
                requester: interaction.member?.user.username as string
            })
        });
        await player?.addSong(queueItems);
        await NotificationService.showNowPlaying(player, interaction, queueItems[0])
    } catch (err) {
        console.log(err, ' Connect Commands');
        await interaction.followUp(messages.failToPlay);
    }
}




