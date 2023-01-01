import {Player, players, QueueItem} from "../../models/player";
import {Message} from "discord.js";
import {entersState, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus} from "@discordjs/voice";
import {YoutubeService} from "../../services/youtube";
import {Song} from "../../types/song";
import {yt_validate} from 'play-dl'
import {NotificationService} from "../../services/notification";
import messages from "../../constants/messages";
import {MusicAreas} from '../../mongodb/music-area.model'
const promtUserToJoin = async (msg: any) => {
    let player = players.get(msg.guildId as string) as Player;
    if (!player) {
        if (
            msg.member.voice.channelId !== null
        ) {
            const voiceChannel = msg.member.voice;
            player = new Player(
                await joinVoiceChannel({
                    channelId: voiceChannel.channelId,
                    guildId: voiceChannel.guild.id,
                    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
                }),
                voiceChannel.guild.id as string
            );
            await players.set(voiceChannel.guild.id as string, player);
            return player;
        }
    }

    if (!player) {
        await msg.channel.send(messages.joinVoiceChannel);
        console.log('chua set up dc player');
        return null;
    }
    await processInput(msg, player);
}

const enterReadyState = async (player: Player, msg: any) => {
    if (!player) {
        return;
    } else {
        const voiceChannel = msg.member.voice;
        await joinVoiceChannel({
            channelId: voiceChannel.channelId,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        })
    }
    try {
        //  bot van vao nhung chua co player
        await entersState(
            <VoiceConnection>player?.voiceConnection,
            VoiceConnectionStatus.Ready,
            10e3,
        );
    } catch (error) {
        await msg.channel.send(messages.failToJoinVoiceChannel);
        console.log(error)
        return;
    }
}

const processInput = async (msg: any, player: Player) => {
    let input = msg.content;
    try {
        await YoutubeService.getVideoDetail(input)
            .then(async (song: Song) => {
                const queueItem: QueueItem = {
                    song,
                    requester: msg.member?.user.username as string
                }
                console.log(`[INFO]: ${song.url}, requester: ${msg.member?.user.username}`)
                await player?.addSong([queueItem])
                await NotificationService.showNowPlayingMsg(player, msg, queueItem);
            })
    } catch (e) {
        console.log(e, ' Connect Commands');
        await msg.channel.send(messages.failToPlay);
    }
}

const handleYoutubeLink = async (msg: Message) => {
    await MusicAreas
        .findOne(
            {textChannelId: msg.channel.id},
            async (err: any, musicAreaChannel: any) => {
                if (msg === null || msg === undefined) {
                    //@ts-ignore
                    await msg.channel.send('Message Deleted');
                    return;
                }

                if (musicAreaChannel === null || musicAreaChannel === undefined) {
                    console.log('not found')
                    return;
                }

                if (
                    (msg.content.startsWith('https') &&
                        yt_validate(msg.content) === 'video') ||
                    (msg.content.startsWith('https') &&
                        msg.content.includes('&list=RD'))
                )
                {
                    await promtUserToJoin(msg)
                        .then(async player => {
                            if (player == null || player == undefined) {
                                console.log('Already got a player!')
                                return;
                            }
                            // @ts-ignore
                            await enterReadyState(player, msg);
                            // @ts-ignore
                            await processInput(msg, player);
                        })
                        .catch(e => {
                            console.log('Error at play by message!')
                            console.log(e)
                        })
                }
    }).clone()

}

export default {
    handleYoutubeLink
}
